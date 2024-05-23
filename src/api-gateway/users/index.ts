import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as apiGatewayUserResource from "./resources";
import * as apiGatewayUserMethod from "./methods";
import * as apiGatewayUserIntegrations from "./integrations";
import * as apiGatewayCommon from "../common";

interface CreateUserAPIGatewayParams {
  name: string;
  handler: aws.lambda.Function;
  provider: pulumi.ProviderResource;
  env: string;
  projectName: string;
}

export function createUsersAPIGateway(args: CreateUserAPIGatewayParams) {
  const { name, handler, provider, env, projectName } = args;
  const api = new aws.apigateway.RestApi(name, {}, { provider });

  const { verifyOTPResource, sendOTPResource, refreshSessionResource } =
    apiGatewayUserResource.createAPIGatewayResources({ api, projectName, env });
  const { verifyOTPPostMethod, sendOTPPostMethod, refreshSessionPostMethod } =
    apiGatewayUserMethod.createAPIGatewayMethods({
      api: api,
      sendOTPResource: sendOTPResource,
      verifyOTPResource: verifyOTPResource,
      refreshSessionResource: refreshSessionResource,
      env,
      projectName,
    });
  apiGatewayUserIntegrations.createAPIGatewayIntegrations({
    api: api,
    handler: handler,
    sendOTPPostMethod: sendOTPPostMethod,
    verifyOTPPostMethod: verifyOTPPostMethod,
    verifyOTPResource: verifyOTPResource,
    sendOTPResource: sendOTPResource,
    refreshSessionResource: refreshSessionResource,
    refreshSessionMethod: refreshSessionPostMethod,
    env,
    projectName,
  });

  // Enable API Gateway to invoke the Lambda function
  new aws.lambda.Permission(`${name}-api-lambda-permission`, {
    action: "lambda:InvokeFunction",
    function: handler.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`, // Allow invoking the function via any method on any path of this API
  });

  apiGatewayCommon.deployApiGateway({
    stageName: `${env}-users`,
    provider,
    env,
    api,
    methods: [sendOTPPostMethod, verifyOTPPostMethod, refreshSessionPostMethod],
    name,
  });

  return api;
}
