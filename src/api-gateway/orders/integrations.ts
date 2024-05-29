import * as aws from "@pulumi/aws";
import { Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  orderResource: Resource;
  orderResourceAuth: Resource;
  updateOrderResource: Resource;
  updateOrderResourceAuth: Resource;
  createOrderPostMethod: Method;
  createOrderPostMethodAuth: Method;
  getOrderGetMethod: Method;
  getOrderGetMethodAuth: Method;
  updateOrderPutMethod: Method;
  updateOrderPutMethodAuth: Method;
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
    updateOrderPutMethod,
    updateOrderResource,
    orderResource,
    createOrderPostMethod,
    orderResourceAuth,
    createOrderPostMethodAuth,
    getOrderGetMethodAuth,
    updateOrderResourceAuth,
    updateOrderPutMethodAuth,
    handler,
    projectName,
    env,
  } = args;

  new aws.apigateway.Integration(
    `${env}-${projectName}-create-order-integration`,
    {
      restApi: api.id,
      resourceId: orderResource.id,
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
      resourceId: orderResourceAuth.id,
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
      resourceId: orderResource.id,
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
      resourceId: orderResourceAuth.id,
      httpMethod: getOrderGetMethodAuth.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-update-order-integration`,
    {
      restApi: api.id,
      resourceId: updateOrderResource.id,
      httpMethod: updateOrderPutMethod.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-update-order-auth-integration`,
    {
      restApi: api.id,
      resourceId: updateOrderResourceAuth.id,
      httpMethod: updateOrderPutMethodAuth.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  return api;
}
