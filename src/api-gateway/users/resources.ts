import * as aws from "@pulumi/aws";
import { RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayResourcesParams {
  api: RestApi;
  projectName: string;
  env: string;
}

export function createAPIGatewayResources(
  args: CreateAPIGatewayResourcesParams,
) {
  const { api, env, projectName } = args;

  const usersResource = new aws.apigateway.Resource(`${env}-${projectName}-user-resource`, {
    restApi: api.id,
    parentId: api.rootResourceId,
    pathPart: "users",
  });

  const sendOTPResource = new aws.apigateway.Resource(`${env}-${projectName}-send-otp-resource`, {
    restApi: api.id,
    parentId: usersResource.id,
    pathPart: "send-otp",
  });

  const verifyOTPResource = new aws.apigateway.Resource(`${env}-${projectName}-verify-otp-resource`, {
    restApi: api.id,
    parentId: usersResource.id,
    pathPart: "verify-otp",
  });

  const refreshSessionResource = new aws.apigateway.Resource(
    `${env}-${projectName}-refresh-session-resource`,
    {
      restApi: api.id,
      parentId: usersResource.id,
      pathPart: "refresh-session",
    },
  );

  return { sendOTPResource, verifyOTPResource, refreshSessionResource };
}
