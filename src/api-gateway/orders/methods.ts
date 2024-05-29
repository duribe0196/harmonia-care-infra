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
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id, // Opcional: asocia el autorizer de Cognito
      requestParameters: {
        "method.request.header.Authorization": false, // Opcional: no requiere el encabezado Authorization
      },
    },
  );

  const getOrderGetMethod = new aws.apigateway.Method(
    `${env}-${projectName}-get-order-get-method`,
    {
      restApi: api.id,
      resourceId: orderResource.id,
      httpMethod: "GET",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id, // Opcional: asocia el autorizer de Cognito
      requestParameters: {
        "method.request.header.Authorization": false, // Opcional: no requiere el encabezado Authorization
      },
    },
  );

  const updateOrderPutMethod = new aws.apigateway.Method(
    `${env}-${projectName}-update-order-put-method`,
    {
      restApi: api.id,
      resourceId: updateOrderResource.id,
      httpMethod: "PUT",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id, // Opcional: asocia el autorizer de Cognito
      requestParameters: {
        "method.request.header.Authorization": false, // Opcional: no requiere el encabezado Authorization
      },
    },
  );

  return {
    createOrderPostMethod,
    getOrderGetMethod,
    updateOrderPutMethod,
  };
}
