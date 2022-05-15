import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

const _default = new gcp.cloudrun.Service('website-deployment', {
    location: 'us-central1',
    template: {
        spec: {
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
});
const noauthIAMPolicy = gcp.organizations.getIAMPolicy({
    bindings: [
        {
            role: 'roles/run.invoker',
            members: ['allUsers'],
        },
    ],
});
const noauthIamPolicy = new gcp.cloudrun.IamPolicy('noauthIamPolicy', {
    location: _default.location,
    project: _default.project,
    service: _default.name,
    policyData: noauthIAMPolicy.then(
        (noauthIAMPolicy) => noauthIAMPolicy.policyData,
    ),
});
