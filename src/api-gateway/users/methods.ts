import * as aws from "@pulumi/aws";
import { Authorizer, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayMethodsParams {
  api: RestApi;
  sendOTPResource: Resource;
  verifyOTPResource: Resource;
  refreshSessionResource: Resource;
  userInfoResource: Resource;
  signOutResource: Resource;
  projectName: string;
  env: string;
  authorizer: Authorizer;
}

export function createAPIGatewayMethods(args: CreateAPIGatewayMethodsParams) {
  const {
    api,
    sendOTPResource,
    verifyOTPResource,
    refreshSessionResource,
    userInfoResource,
    signOutResource,
    env,
    projectName,
    authorizer,
  } = args;

  const sendOTPPostMethod = new aws.apigateway.Method(
    `${env}-${projectName}-send-otp-post-method`,
    {
      restApi: api.id,
      resourceId: sendOTPResource.id,
      httpMethod: "POST",
      authorization: "NONE",
    },
  );

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

  const getUserInfoGetMethod = new aws.apigateway.Method(
    `${env}-${projectName}-get-user-info-get-method`,
    {
      restApi: api.id,
      resourceId: userInfoResource.id,
      httpMethod: "GET",
      authorization: "NONE",
    },
  );

  const signOutPostMethod = new aws.apigateway.Method(
    `${env}-${projectName}-sign-out-post-method`,
    {
      restApi: api.id,
      resourceId: signOutResource.id,
      httpMethod: "POST",
      authorization: "COGNITO_USER_POOLS",
      authorizerId: authorizer.id,
    },
  );

  return {
    sendOTPPostMethod,
    verifyOTPPostMethod,
    refreshSessionPostMethod,
    getUserInfoGetMethod,
    signOutPostMethod,
  };
}
