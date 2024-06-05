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

  const productResource = new aws.apigateway.Resource(
    `${env}-${projectName}-product-resource`,
    {
      restApi: api.id,
      parentId: api.rootResourceId,
      pathPart: "products",
    },
  );

  const productIdResource = new aws.apigateway.Resource(
    `${env}-${projectName}-product-id-resource`,
    {
      restApi: api.id,
      parentId: productResource.id,
      pathPart: "{productId}",
    },
  );

  const createProductResource = new aws.apigateway.Resource(
    `${env}-${projectName}-create-product-resource`,
    {
      restApi: api.id,
      parentId: productResource.id,
      pathPart: "create",
    },
  );

  return {
    createProductResource,
    productResource,
    productIdResource,
  };
}
