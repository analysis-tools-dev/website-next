import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/google-native';

const enableCloudRun = new gcp.servicemanagement.v1.Service('EnableCloudRun', {
    serviceName: 'run.googleapis.com',
});

const service = new gcp.run.v2.Service(
    'website-deployment',
    {
        serviceId: 'website-deployment',
        project: 'analysis-tools-dev',
        location: 'us-central1',
        template: {
            containers: [
                {
                    image: process.env.IMAGE_NAME as string,
                    ports: [
                        {
                            containerPort: 3000,
                        },
                    ],
                },
            ],
        },
    },
    { dependsOn: enableCloudRun },
);
new gcp.run.v2.ServiceIamPolicy('allow-all', {
    serviceId: service.name,
    project: 'analysis-tools-dev',
    location: 'us-central1',
    bindings: [
        {
            members: ['allUsers'],
            role: 'roles/run.invoker',
        },
    ],
});
