import * as aws from "@pulumi/aws";
import { Method, RestApi } from "@pulumi/aws/apigateway";
import { ProviderResource } from "@pulumi/pulumi";

interface IDeployApiGatewayArgs {
  provider: ProviderResource;
  api: RestApi;
  methods: Method[];
  env: string;
  name: string;
  stageName: string;
}

export function deployApiGateway(args: IDeployApiGatewayArgs) {
  const { api, methods, name, provider, stageName } = args;
  const deployment = new aws.apigateway.Deployment(
    `${name}-deployment`,
    {
      restApi: api,
      description: `Deployment on ${new Date().toISOString()}`,
    },
    { dependsOn: methods },
  );

  new aws.apigateway.Stage(
    `${name}-stage`,
    {
      stageName: stageName,
      deployment: deployment,
      restApi: api,
    },
    { deleteBeforeReplace: true, dependsOn: [deployment] },
  );
}
