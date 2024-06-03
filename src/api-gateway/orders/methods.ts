import * as aws from "@pulumi/aws";
import { Authorizer, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  api: RestApi;
  removeProductFromOrderPublicResource: Resource;
  removeProductFromOrderAuthResource: Resource;
  publicOrderResource: Resource;
  authOrderResource: Resource;
  authorizer: Authorizer;
  env: string;
  projectName: string;
}

export function createAPIGatewayMethods(args: CreateAPIGatewayMethodsParams) {
  const {
    api,
    removeProductFromOrderPublicResource,
    publicOrderResource,
    authorizer,
    projectName,
    removeProductFromOrderAuthResource,
    authOrderResource,
    env,
  } = args;

  const createOrderPostMethod = new aws.apigateway.Method(
    `${env}-${projectName}-create-order-post-method`,
    {
      restApi: api.id,
      resourceId: publicOrderResource.id,
      httpMethod: "POST",
      authorization: "NONE",
      authorizerId: authorizer.id,
    },
  );

  const createOrderPostMethodAuth = new aws.apigateway.Method(
    `${env}-${projectName}-create-order-post-method-auth`,
    {
      restApi: api.id,
      resourceId: authOrderResource.id,
      httpMethod: "POST",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
    },
  );

  const getOrderGetMethod = new aws.apigateway.Method(
    `${env}-${projectName}-get-order-get-method`,
    {
      restApi: api.id,
      resourceId: publicOrderResource.id,
      httpMethod: "GET",
      authorization: "NONE",
    },
  );

  const getOrderGetMethodAuth = new aws.apigateway.Method(
    `${env}-${projectName}-get-order-get-method-auth`,
    {
      restApi: api.id,
      resourceId: authOrderResource.id,
      httpMethod: "GET",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
    },
  );

  const removeProductFromOrderPutMethod = new aws.apigateway.Method(
    `${env}-${projectName}-remove-product-from-order-put-method`,
    {
      restApi: api.id,
      resourceId: removeProductFromOrderPublicResource.id,
      httpMethod: "PUT",
      authorization: "NONE",
      requestParameters: {
        "method.request.path.orderId": true,
      },
    },
  );

  const removeProductOrderPutMethodAuth = new aws.apigateway.Method(
    `${env}-${projectName}-remove-product-from-order-put-method-auth`,
    {
      restApi: api.id,
      resourceId: removeProductFromOrderAuthResource.id,
      httpMethod: "PUT",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
      requestParameters: {
        "method.request.path.orderId": true,
      },
    },
  );

  return {
    createOrderPostMethod,
    getOrderGetMethod,
    removeProductFromOrderPutMethod,
    createOrderPostMethodAuth,
    getOrderGetMethodAuth,
    removeProductOrderPutMethodAuth,
  };
}
