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

  const updateOrderResource = new aws.apigateway.Resource(
    `${env}-${projectName}-update-order-resource`,
    {
      restApi: api.id,
      parentId: orderResource.id,
      pathPart: "{orderId}",
    },
  );

  return { orderResource, updateOrderResource };
}
