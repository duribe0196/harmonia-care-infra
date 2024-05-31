import * as aws from "@pulumi/aws";
import { Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  orderResource: Resource;
  orderResourceAuth: Resource;
  removeProductFromOrderResource: Resource;
  removeProductFromOrderResourceAuth: Resource;
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
    removeProductFromOrderResource,
    orderResource,
    createOrderPostMethod,
    orderResourceAuth,
    createOrderPostMethodAuth,
    getOrderGetMethodAuth,
    removeProductFromOrderResourceAuth,
    removeProductOrderPutMethodAuth,
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
    `${env}-${projectName}-remove-product-from-order-integration`,
    {
      restApi: api.id,
      resourceId: removeProductFromOrderResource.id,
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
      resourceId: removeProductFromOrderResourceAuth.id,
      httpMethod: removeProductOrderPutMethodAuth.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  return api;
}
