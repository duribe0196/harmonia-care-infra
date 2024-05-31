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

  const orderResource = new aws.apigateway.Resource(
    `${env}-${projectName}-order-resource`,
    {
      restApi: api.id,
      parentId: api.rootResourceId,
      pathPart: "order",
    },
  );

  const orderResourceAuth = new aws.apigateway.Resource(
    `${env}-${projectName}-order-resource-auth`,
    {
      restApi: api.id,
      parentId: orderResource.id,
      pathPart: "auth",
    },
  );

  const removeProductFromOrderResource = new aws.apigateway.Resource(
    `${env}-${projectName}-remove-product-from-order-resource`,
    {
      restApi: api.id,
      parentId: orderResource.id,
      pathPart: "remove-product",
    },
  );

  const removeProductFromOrderResourceAuth = new aws.apigateway.Resource(
    `${env}-${projectName}-remove-product-from-order-resource-auth`,
    {
      restApi: api.id,
      parentId: orderResourceAuth.id,
      pathPart: "remove-product",
    },
  );

  return {
    orderResource,
    orderResourceAuth,
    removeProductFromOrderResource,
    removeProductFromOrderResourceAuth,
  };
}
