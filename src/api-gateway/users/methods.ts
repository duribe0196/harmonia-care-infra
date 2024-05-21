import * as aws from "@pulumi/aws";
import { Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  api: RestApi;
  sendOTPResource: Resource;
  verifyOTPResource: Resource;
  refreshSessionResource: Resource;
  projectName: string;
  env: string;
}

export function createAPIGatewayMethods(args: CreateAPIGatewayMethodsParams) {
  const { api, sendOTPResource, verifyOTPResource, refreshSessionResource, env, projectName } =
    args;

  const sendOTPPostMethod = new aws.apigateway.Method(`${env}-${projectName}-send-otp-post-method`, {
    restApi: api.id,
    resourceId: sendOTPResource.id,
    httpMethod: "POST",
    authorization: "NONE",
  });

  const verifyOTPPostMethod = new aws.apigateway.Method(
    `${env}-${projectName}-verify-otp-post-method`,
    {
      restApi: api.id,
      resourceId: verifyOTPResource.id,
      httpMethod: "POST",
      authorization: "NONE",
    },
  );

  const refreshSessionPostMethod = new aws.apigateway.Method(
    `${env}-${projectName}-refresh-session-post-method`,
    {
      restApi: api.id,
      resourceId: refreshSessionResource.id,
      httpMethod: "POST",
      authorization: "NONE",
    },
  );

  return {
    sendOTPPostMethod,
    verifyOTPPostMethod,
    refreshSessionPostMethod,
  };
}
