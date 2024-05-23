import * as aws from "@pulumi/aws";
import { Authorizer, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  api: RestApi;
  createProductResource: Resource;
  productResource: Resource;
  updateProductResource: Resource;
  authorizer: Authorizer;
  env: string;
  projectName: string;
}

export function createAPIGatewayMethods(args: CreateAPIGatewayMethodsParams) {
  const {
    api,
    createProductResource,
    productResource,
    updateProductResource,
    authorizer,
    projectName,
    env,
  } = args;

  const createProductPostMethod = new aws.apigateway.Method(
    `${env}-${projectName}-create-product-post-method`,
    {
      restApi: api.id,
      resourceId: createProductResource.id,
      httpMethod: "POST",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
    },
  );

  const getProductsGetMethod = new aws.apigateway.Method(
    `${env}-${projectName}-get-products-get-method`,
    {
      restApi: api.id,
      resourceId: productResource.id,
      httpMethod: "GET",
      authorization: "NONE",
    },
  );

  const updateProductPutMethod = new aws.apigateway.Method(
    `${env}-${projectName}-update-product-get-method`,
    {
      restApi: api.id,
      resourceId: updateProductResource.id,
      httpMethod: "PUT",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
    },
  );

  return {
    createProductPostMethod,
    getProductsGetMethod,
    updateProductPutMethod,
  };
}
