import * as aws from "@pulumi/aws";
import { Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  removeProductFromOrderPublicResource: Resource;
  removeProductFromOrderAuthResource: Resource;
  checkoutOrderAuthResource: Resource;
  checkoutOrderPublicResource: Resource;
  publicOrderResource: Resource;
  authOrderResource: Resource;
  createOrderPostMethod: Method;
  createOrderPostMethodAuth: Method;
  getOrderGetMethod: Method;
  getOrderGetMethodAuth: Method;
  removeProductFromOrderPutMethodPublic: Method;
  removeProductOrderPutMethodAuth: Method;
  checkoutOrderPutMethodPublic: Method;
  checkoutOrderPutMethodAuth: Method;
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
    removeProductFromOrderPutMethodPublic,
    removeProductFromOrderPublicResource,
    publicOrderResource,
    createOrderPostMethod,
    authOrderResource,
    createOrderPostMethodAuth,
    getOrderGetMethodAuth,
    removeProductFromOrderAuthResource,
    removeProductOrderPutMethodAuth,
    checkoutOrderPutMethodAuth,
    checkoutOrderPutMethodPublic,
    checkoutOrderAuthResource,
    checkoutOrderPublicResource,
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
      httpMethod: removeProductFromOrderPutMethodPublic.httpMethod,
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

  new aws.apigateway.Integration(
    `${env}-${projectName}-checkout-order-auth-integration`,
    {
      restApi: api.id,
      resourceId: checkoutOrderAuthResource.id,
      httpMethod: checkoutOrderPutMethodAuth.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-checkout-order-public-integration`,
    {
      restApi: api.id,
      resourceId: checkoutOrderPublicResource.id,
      httpMethod: checkoutOrderPutMethodPublic.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  return api;
}
