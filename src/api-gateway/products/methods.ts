import * as aws from "@pulumi/aws";
import { Authorizer, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  api: RestApi;
  createProductResource: Resource;
  productResource: Resource;
  productIdResource: Resource;
  authorizer: Authorizer;
  env: string;
  projectName: string;
}

export function createAPIGatewayMethods(args: CreateAPIGatewayMethodsParams) {
  const {
    api,
    createProductResource,
    productResource,
    productIdResource,
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

  const getProductByIdGetMethod = new aws.apigateway.Method(
    `${env}-${projectName}-get-product-by-id-get-method`,
    {
      restApi: api.id,
      resourceId: productIdResource.id,
      httpMethod: "GET",
      authorization: "NONE",
      requestParameters: {
        "method.request.path.productId": true,
      },
    },
  );

  const updateProductPutMethod = new aws.apigateway.Method(
    `${env}-${projectName}-update-product-get-method`,
    {
      restApi: api.id,
      resourceId: productIdResource.id,
      httpMethod: "PUT",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
      requestParameters: {
        "method.request.path.productId": true,
      },
    },
  );

  return {
    createProductPostMethod,
    getProductsGetMethod,
    updateProductPutMethod,
    getProductByIdGetMethod,
  };
}
