import * as aws from "@pulumi/aws";
import { Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  removeProductFromOrderPublicResource: Resource;
  removeProductFromOrderAuthResource: Resource;
  publicOrderResource: Resource;
  authOrderResource: Resource;
  createOrderPostMethod: Method;
  createOrderPostMethodAuth: Method;
  getOrderGetMethod: Method;
  getOrderGetMethodAuth: Method;
  removeProductFromOrderPutMethod: Method;
  removeProductOrderPutMethodAuth: Method;
  handler: aws.lambda.Function;
  env: string;
  projectName: string;
}

export function createAPIGatewayIntegrations(
  args: CreateAPIGatewayIntegrationParams,
) {
  const {
    api,
    getOrderGetMethod,
    removeProductFromOrderPutMethod,
    removeProductFromOrderPublicResource,
    publicOrderResource,
    createOrderPostMethod,
    authOrderResource,
    createOrderPostMethodAuth,
    getOrderGetMethodAuth,
    removeProductFromOrderAuthResource,
    removeProductOrderPutMethodAuth,
    handler,
    projectName,
    env,
  } = args;

  new aws.apigateway.Integration(
    `${env}-${projectName}-create-order-integration`,
    {
      restApi: api.id,
      resourceId: publicOrderResource.id,
      httpMethod: createOrderPostMethod.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-create-order-auth-integration`,
    {
      restApi: api.id,
      resourceId: authOrderResource.id,
      httpMethod: createOrderPostMethodAuth.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-get-order-integration`,
    {
      restApi: api.id,
      resourceId: publicOrderResource.id,
      httpMethod: getOrderGetMethod.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-get-order-auth-integration`,
    {
      restApi: api.id,
      resourceId: authOrderResource.id,
      httpMethod: getOrderGetMethodAuth.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-remove-product-from-order-integration`,
    {
      restApi: api.id,
      resourceId: removeProductFromOrderPublicResource.id,
      httpMethod: removeProductFromOrderPutMethod.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-remove-product-from-order-auth-integration`,
    {
      restApi: api.id,
      resourceId: removeProductFromOrderAuthResource.id,
      httpMethod: removeProductOrderPutMethodAuth.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  return api;
}
