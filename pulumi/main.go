package main

import (
	"fmt"
	"os"

	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/cloudrun"

	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi/config"
)

func requireEnv(key string) (string, error) {
	value := os.Getenv(key)
	if value == "" {
		return "", fmt.Errorf("missing required environment variable: %s", key)
	}
	return value, nil
}

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		conf := config.New(ctx, "service")
		imageName, err := requireEnv("IMAGE_NAME")
		if err != nil {
			return err
		}
		algoliaApiKey, err := requireEnv("ALGOLIA_API_KEY")
		if err != nil {
			return err
		}
		service, err := cloudrun.NewService(ctx, conf.Require("name"), &cloudrun.ServiceArgs{
			Location: pulumi.String(conf.Require("location")),
			Template: &cloudrun.ServiceTemplateArgs{
				Spec: &cloudrun.ServiceTemplateSpecArgs{
					Containers: cloudrun.ServiceTemplateSpecContainerArray{
						&cloudrun.ServiceTemplateSpecContainerArgs{
							Image: pulumi.String(imageName),
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
									Value: pulumi.String(algoliaApiKey),
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
		_, err = cloudrun.NewIamMember(ctx, "noauthInvoker", &cloudrun.IamMemberArgs{
			Location: service.Location,
			Project:  service.Project,
			Service:  service.Name,
			Role:     pulumi.String("roles/run.invoker"),
			Member:   pulumi.String("allUsers"),
		})
		if err != nil {
			return err
		}
		return nil
	})
}
