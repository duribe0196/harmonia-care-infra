import * as aws from "@pulumi/aws";
import { Authorizer, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  api: RestApi;
  createProductResource: Resource;
  authorizer: Authorizer;
  env: string;
  projectName: string;
}

export function createAPIGatewayMethods(args: CreateAPIGatewayMethodsParams) {
  const { api, createProductResource, authorizer, projectName, env } = args;

  const createProductPostMethod = new aws.apigateway.Method(
    `${env}-${projectName}-create-product-post-method`,
    {
      restApi: api.id,
      resourceId: createProductResource.id,
      httpMethod: "POST",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
    },
  );

  return {
    createProductPostMethod,
  };
}
