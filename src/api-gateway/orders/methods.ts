import * as aws from "@pulumi/aws";
import { Authorizer, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  api: RestApi;
  updateOrderResource: Resource;
  orderResource: Resource;
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
    env,
  } = args;

  const createOrderPostMethod = new aws.apigateway.Method(
    `${env}-${projectName}-create-order-post-method`,
    {
      restApi: api.id,
      resourceId: orderResource.id,
      httpMethod: "POST",
      authorization: "NONE",
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

  const updateOrderPutMethod = new aws.apigateway.Method(
    `${env}-${projectName}-update-order-put-method`,
    {
      restApi: api.id,
      resourceId: updateOrderResource.id,
      httpMethod: "PUT",
      authorization: "NONE",
    },
  );

  return {
    createOrderPostMethod,
    getOrderGetMethod,
    updateOrderPutMethod,
  };
}
