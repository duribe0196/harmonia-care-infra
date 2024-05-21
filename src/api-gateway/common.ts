import * as aws from "@pulumi/aws";
import { Method, RestApi } from "@pulumi/aws/apigateway";

interface IDeployApiGatewayArgs {
  api: RestApi;
  methods: Method[];
  env: string;
  name: string;
}

export function deployApiGateway(args: IDeployApiGatewayArgs) {
  const { api, methods, env, name, } = args;
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
      stageName: env,
      deployment: deployment,
      restApi: api,
    },
    { deleteBeforeReplace: true, dependsOn: [deployment] },
  );
}
