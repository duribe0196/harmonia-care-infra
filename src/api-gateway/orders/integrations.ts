import * as aws from "@pulumi/aws";
import { Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  orderResource: Resource;
  updateOrderResource: Resource;
  createOrderPostMethod: Method;
  getOrderGetMethod: Method;
  updateOrderPutMethod: Method;
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

  return api;
}
