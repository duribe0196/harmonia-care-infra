import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as apiGatewayOrdersResource from "./resources";
import * as apiGatewayOrdersMethods from "./methods";
import * as apiGatewayOrdersIntegrations from "./integrations";
import * as apiGatewayCommon from "../common";

interface CreateOrdersAPIGatewayParams {
  name: string;
  handler: aws.lambda.Function;
  provider: pulumi.ProviderResource;
  userPool: aws.cognito.UserPool;
  env: string;
  projectName: string;
}

export function createOrdersAPIGateway(args: CreateOrdersAPIGatewayParams) {
  const { name, handler, provider, userPool, env, projectName } = args;
  const api = new aws.apigateway.RestApi(name, {}, { provider });

  // Create an API Gateway Authorizer using the Cognito User Pool
  const authorizer = new aws.apigateway.Authorizer(
    `${env}-${projectName}-orders-cognito-authorizer`,
    {
      restApi: api,
      type: "COGNITO_USER_POOLS",
      identitySource: "method.request.header.Authorization",
      providerArns: [userPool.arn],
    },
  );

  const { updateOrderResource, orderResource } =
    apiGatewayOrdersResource.createAPIGatewayResources({
      api,
      env,
      projectName,
    });

  const { updateOrderPutMethod, getOrderGetMethod, createOrderPostMethod } =
    apiGatewayOrdersMethods.createAPIGatewayMethods({
      api,
      env,
      orderResource,
      updateOrderResource,
      projectName,
      authorizer,
    });

  apiGatewayOrdersIntegrations.createAPIGatewayIntegrations({
    api,
    env,
    createOrderPostMethod,
    orderResource,
    updateOrderResource,
    getOrderGetMethod,
    handler,
    updateOrderPutMethod,
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
    stageName: `${env}-orders`,
    provider,
    name: name,
    env,
    api,
    methods: [updateOrderPutMethod, getOrderGetMethod, createOrderPostMethod],
  });

  return api;
}
