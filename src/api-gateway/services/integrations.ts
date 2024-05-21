import * as aws from "@pulumi/aws";
import { Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  createProductResource: Resource;
  createProductPostMethod: Method;
  handler: aws.lambda.Function;
  env: string;
  projectName: string;
}

export function createAPIGatewayIntegrations(
  args: CreateAPIGatewayIntegrationParams,
) {
  const { api, createProductPostMethod, createProductResource, handler, projectName, env } = args;

  new aws.apigateway.Integration(`${env}-${projectName}-create-product-integration`, {
    restApi: api.id,
    resourceId: createProductResource.id,
    httpMethod: createProductPostMethod.httpMethod,
    type: "AWS_PROXY",
    uri: handler.invokeArn,
    integrationHttpMethod: "POST",
  });

  return api;
}
