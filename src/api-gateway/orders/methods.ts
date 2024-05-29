import * as aws from "@pulumi/aws";
import { Authorizer, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  api: RestApi;
  updateOrderResource: Resource;
  updateOrderResourceAuth: Resource;
  orderResource: Resource;
  orderResourceAuth: Resource;
  authorizer: Authorizer;
  env: string;
  projectName: string;
}

export function createAPIGatewayMethods(args: CreateAPIGatewayMethodsParams) {
  const {
    api,
    updateOrderResource,
    orderResource,
    authorizer,
    projectName,
    updateOrderResourceAuth,
    orderResourceAuth,
    env,
  } = args;

  const createOrderPostMethod = new aws.apigateway.Method(
    `${env}-${projectName}-create-order-post-method`,
    {
      restApi: api.id,
      resourceId: orderResource.id,
      httpMethod: "POST",
      authorization: "NONE",
      authorizerId: authorizer.id,
    },
  );

  const createOrderPostMethodAuth = new aws.apigateway.Method(
    `${env}-${projectName}-create-order-post-method-auth`,
    {
      restApi: api.id,
      resourceId: orderResourceAuth.id,
      httpMethod: "POST",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
    },
  );

  const getOrderGetMethod = new aws.apigateway.Method(
    `${env}-${projectName}-get-order-get-method`,
    {
      restApi: api.id,
      resourceId: orderResource.id,
      httpMethod: "GET",
      authorization: "NONE",
    },
  );

  const getOrderGetMethodAuth = new aws.apigateway.Method(
    `${env}-${projectName}-get-order-get-method-auth`,
    {
      restApi: api.id,
      resourceId: orderResourceAuth.id,
      httpMethod: "GET",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
    },
  );

  const updateOrderPutMethod = new aws.apigateway.Method(
    `${env}-${projectName}-update-order-put-method`,
    {
      restApi: api.id,
      resourceId: updateOrderResource.id,
      httpMethod: "PUT",
      authorization: "NONE",
    },
  );

  const updateOrderPutMethodAuth = new aws.apigateway.Method(
    `${env}-${projectName}-update-order-put-method-auth`,
    {
      restApi: api.id,
      resourceId: updateOrderResourceAuth.id,
      httpMethod: "PUT",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
    },
  );

  return {
    createOrderPostMethod,
    getOrderGetMethod,
    updateOrderPutMethod,
    createOrderPostMethodAuth,
    getOrderGetMethodAuth,
    updateOrderPutMethodAuth,
  };
}
