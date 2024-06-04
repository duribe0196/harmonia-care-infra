import * as aws from "@pulumi/aws";
import { RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayResourcesParams {
  api: RestApi;
  env: string;
  projectName: string;
}

export function createAPIGatewayResources(
  args: CreateAPIGatewayResourcesParams,
) {
  const { api, projectName, env } = args;

  // Public resources
  const publicResource = new aws.apigateway.Resource(
    `${env}-${projectName}-public-resource`,
    {
      restApi: api.id,
      parentId: api.rootResourceId,
      pathPart: "public",
    },
  );

  const publicOrderResource = new aws.apigateway.Resource(
    `${env}-${projectName}-public-order-resource`,
    {
      restApi: api.id,
      parentId: publicResource.id,
      pathPart: "order",
    },
  );

  const removeProductPublicResource = new aws.apigateway.Resource(
    `${env}-${projectName}-remove-product-public-resource`,
    {
      restApi: api.id,
      parentId: publicOrderResource.id,
      pathPart: "remove-product",
    },
  );

  const checkoutPublicResource = new aws.apigateway.Resource(
    `${env}-${projectName}-checkout-public-resource`,
    {
      restApi: api.id,
      parentId: publicOrderResource.id,
      pathPart: "checkout",
    },
  );

  const removeProductFromOrderPublicResource = new aws.apigateway.Resource(
    `${env}-${projectName}-remove-product-from-order-public-resource`,
    {
      restApi: api.id,
      parentId: removeProductPublicResource.id,
      pathPart: "{orderId}",
    },
  );

  const checkoutOrderPublicResource = new aws.apigateway.Resource(
    `${env}-${projectName}-checkout-order-public-resource`,
    {
      restApi: api.id,
      parentId: checkoutPublicResource.id,
      pathPart: "{orderId}",
    },
  );

  // Auth resources
  const authResource = new aws.apigateway.Resource(
    `${env}-${projectName}-auth-resource`,
    {
      restApi: api.id,
      parentId: api.rootResourceId,
      pathPart: "auth",
    },
  );

  const authOrderResource = new aws.apigateway.Resource(
    `${env}-${projectName}-auth-order-resource`,
    {
      restApi: api.id,
      parentId: authResource.id,
      pathPart: "order",
    },
  );

  const removeProductAuthResource = new aws.apigateway.Resource(
    `${env}-${projectName}-remove-product-auth-resource`,
    {
      restApi: api.id,
      parentId: authOrderResource.id,
      pathPart: "remove-product",
    },
  );

  const checkoutAuthResource = new aws.apigateway.Resource(
    `${env}-${projectName}-checkout-auth-resource`,
    {
      restApi: api.id,
      parentId: authOrderResource.id,
      pathPart: "checkout",
    },
  );

  const removeProductFromOrderAuthResource = new aws.apigateway.Resource(
    `${env}-${projectName}-remove-product-from-order-resource-auth`,
    {
      restApi: api.id,
      parentId: removeProductAuthResource.id,
      pathPart: "{orderId}",
    },
  );

  const checkoutOrderAuthResource = new aws.apigateway.Resource(
    `${env}-${projectName}-checkout-order-resource-auth`,
    {
      restApi: api.id,
      parentId: checkoutAuthResource.id,
      pathPart: "{orderId}",
    },
  );

  return {
    publicOrderResource,
    authOrderResource,
    removeProductFromOrderPublicResource,
    removeProductFromOrderAuthResource,
    checkoutOrderPublicResource,
    checkoutOrderAuthResource,
  };
}
