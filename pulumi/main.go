package main

import (
	"os"

	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/cloudrun"
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/organizations"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi/config"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		conf := config.New(ctx, "service")
		service, err := cloudrun.NewService(ctx, conf.Require("name"), &cloudrun.ServiceArgs{
			Location: pulumi.String("us-central1"),
			Template: &cloudrun.ServiceTemplateArgs{
				Spec: &cloudrun.ServiceTemplateSpecArgs{
					Containers: cloudrun.ServiceTemplateSpecContainerArray{
						&cloudrun.ServiceTemplateSpecContainerArgs{
							Image: pulumi.String(os.Getenv("IMAGE_NAME")),
							Ports: cloudrun.ServiceTemplateSpecContainerPortArray{
								&cloudrun.ServiceTemplateSpecContainerPortArgs{
									ContainerPort: pulumi.Int(3000),
								},
							},
							Resources: &cloudrun.ServiceTemplateSpecContainerResourcesArgs{
								Limits: pulumi.StringMap{
									"cpu":    pulumi.String("1"),
									"memory": pulumi.String("1Gi"),
								},
							},
							Envs: cloudrun.ServiceTemplateSpecContainerEnvArray{
								&cloudrun.ServiceTemplateSpecContainerEnvArgs{
									Name:  pulumi.String("PUBLIC_HOST"),
									Value: pulumi.String(conf.Require("public_url")),
								},
								&cloudrun.ServiceTemplateSpecContainerEnvArgs{
									Name:  pulumi.String("ALGOLIA_APP_ID"),
									Value: pulumi.String(conf.Require("algolia_app_id")),
								},
								&cloudrun.ServiceTemplateSpecContainerEnvArgs{
									Name:  pulumi.String("ALGOLIA_API_KEY"),
									Value: pulumi.String(os.Getenv("ALGOLIA_API_KEY")),
								},
							},
						},
					},
				},
			},
		})
		if err != nil {
			return err
		}
		noauthIAMPolicy, err := organizations.LookupIAMPolicy(ctx, &organizations.LookupIAMPolicyArgs{
			Bindings: []organizations.GetIAMPolicyBinding{
				{
					Role: "roles/run.invoker",
					Members: []string{
						"allUsers",
					},
				},
			},
		}, nil)
		if err != nil {
			return err
		}
		_, err = cloudrun.NewIamPolicy(ctx, "noauthIamPolicy", &cloudrun.IamPolicyArgs{
			Location:   service.Location,
			Project:    service.Project,
			Service:    service.Name,
			PolicyData: pulumi.String(noauthIAMPolicy.PolicyData),
		})
		if err != nil {
			return err
		}
		return nil
	})
}
