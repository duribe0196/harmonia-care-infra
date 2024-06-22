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
  userPool: aws.cognito.UserPool;
  env: string;
  projectName: string;
}

export function createUsersAPIGateway(args: CreateUserAPIGatewayParams) {
  const { name, handler, provider, env, projectName, userPool } = args;
  const api = new aws.apigateway.RestApi(
    name,
    {},
    { provider, dependsOn: [userPool] },
  );

  // Create an API Gateway Authorizer using the Cognito User Pool
  const authorizer = new aws.apigateway.Authorizer(
    `${env}-${projectName}-users-cognito-authorizer`,
    {
      restApi: api,
      type: "COGNITO_USER_POOLS",
      identitySource: "method.request.header.Authorization",
      providerArns: [userPool.arn],
    },
  );

  const {
    verifyOTPResource,
    sendOTPResource,
    refreshSessionResource,
    userInfoResource,
    signOutResource,
  } = apiGatewayUserResource.createAPIGatewayResources({
    api,
    projectName,
    env,
  });
  const {
    verifyOTPPostMethod,
    sendOTPPostMethod,
    refreshSessionPostMethod,
    getUserInfoGetMethod,
    signOutPostMethod,
  } = apiGatewayUserMethod.createAPIGatewayMethods({
    api: api,
    sendOTPResource: sendOTPResource,
    verifyOTPResource: verifyOTPResource,
    refreshSessionResource: refreshSessionResource,
    userInfoResource: userInfoResource,
    signOutResource: signOutResource,
    env,
    projectName,
    authorizer,
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
    userInfoResource: userInfoResource,
    getUserInfoGetMethod: getUserInfoGetMethod,
    signOutPostMethod: signOutPostMethod,
    signOutResource: signOutResource,
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
    methods: [
      sendOTPPostMethod,
      verifyOTPPostMethod,
      refreshSessionPostMethod,
      getUserInfoGetMethod,
      signOutPostMethod,
    ],
    name,
  });

  return api;
}
