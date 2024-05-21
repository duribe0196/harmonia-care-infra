import * as aws from "@pulumi/aws";
import { Method, Resource, RestApi } from "@pulumi/aws/apigateway";

interface CreateAPIGatewayIntegrationParams {
  api: RestApi;
  sendOTPResource: Resource;
  verifyOTPResource: Resource;
  refreshSessionResource: Resource;
  sendOTPPostMethod: Method;
  verifyOTPPostMethod: Method;
  refreshSessionMethod: Method;
  handler: aws.lambda.Function;
  projectName: string;
  env: string;
}

export function createAPIGatewayIntegrations(
  args: CreateAPIGatewayIntegrationParams,
) {
  const {
    api,
    sendOTPResource,
    verifyOTPResource,
    verifyOTPPostMethod,
    sendOTPPostMethod,
    refreshSessionResource,
    refreshSessionMethod,
    handler,
    env,
    projectName,
  } = args;

  new aws.apigateway.Integration(`${env}-${projectName}-send-otp-post-method-integration`, {
    restApi: api.id,
    resourceId: sendOTPResource.id,
    httpMethod: sendOTPPostMethod.httpMethod,
    type: "AWS_PROXY",
    uri: handler.invokeArn,
    integrationHttpMethod: "POST",
  });

  new aws.apigateway.Integration(`${env}-${projectName}-verify-otp-post-method-integration`, {
    restApi: api.id,
    resourceId: verifyOTPResource.id,
    httpMethod: verifyOTPPostMethod.httpMethod,
    type: "AWS_PROXY",
    uri: handler.invokeArn,
    integrationHttpMethod: "POST",
  });

  new aws.apigateway.Integration(`${env}-${projectName}-refresh-session-post-method-integration`, {
    restApi: api.id,
    resourceId: refreshSessionResource.id,
    httpMethod: refreshSessionMethod.httpMethod,
    type: "AWS_PROXY",
    uri: handler.invokeArn,
    integrationHttpMethod: "POST",
  });

  return api;
}
