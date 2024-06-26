import * as aws from "@pulumi/aws";
import { Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  createProductResource: Resource;
  productResource: Resource;
  productIdResource: Resource;
  createProductPostMethod: Method;
  getProductsGetMethod: Method;
  updateProductPutMethod: Method;
  getProductByIdGetMethod: Method;
  handler: aws.lambda.Function;
  env: string;
  projectName: string;
}

export function createAPIGatewayIntegrations(
  args: CreateAPIGatewayIntegrationParams,
) {
  const {
    api,
    createProductPostMethod,
    getProductByIdGetMethod,
    createProductResource,
    productIdResource,
    getProductsGetMethod,
    updateProductPutMethod,
    productResource,
    handler,
    projectName,
    env,
  } = args;

  new aws.apigateway.Integration(
    `${env}-${projectName}-create-product-integration`,
    {
      restApi: api.id,
      resourceId: createProductResource.id,
      httpMethod: createProductPostMethod.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-get-products-integration`,
    {
      restApi: api.id,
      resourceId: productResource.id,
      httpMethod: getProductsGetMethod.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-get-product-by-id-integration`,
    {
      restApi: api.id,
      resourceId: productIdResource.id,
      httpMethod: getProductByIdGetMethod.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  new aws.apigateway.Integration(
    `${env}-${projectName}-update-products-integration`,
    {
      restApi: api.id,
      resourceId: productIdResource.id,
      httpMethod: updateProductPutMethod.httpMethod,
      type: "AWS_PROXY",
      uri: handler.invokeArn,
      integrationHttpMethod: "POST",
    },
  );

  return api;
}
