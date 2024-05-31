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

  const {
    removeProductFromOrderResourceAuth,
    removeProductFromOrderResource,
    orderResource,
    orderResourceAuth,
  } = apiGatewayOrdersResource.createAPIGatewayResources({
    api,
    env,
    projectName,
  });

  const {
    removeProductFromOrderPutMethod,
    getOrderGetMethod,
    createOrderPostMethod,
    createOrderPostMethodAuth,
    removeProductOrderPutMethodAuth,
    getOrderGetMethodAuth,
  } = apiGatewayOrdersMethods.createAPIGatewayMethods({
    api,
    env,
    orderResource,
    projectName,
    authorizer,
    orderResourceAuth,
    removeProductFromOrderResourceAuth,
    removeProductFromOrderResource,
  });

  apiGatewayOrdersIntegrations.createAPIGatewayIntegrations({
    api,
    env,
    createOrderPostMethod,
    createOrderPostMethodAuth,
    orderResource,
    orderResourceAuth,
    removeProductFromOrderResource,
    removeProductOrderPutMethodAuth,
    getOrderGetMethod,
    getOrderGetMethodAuth,
    handler,
    removeProductFromOrderPutMethod,
    removeProductFromOrderResourceAuth,
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
    methods: [
      removeProductOrderPutMethodAuth,
      getOrderGetMethod,
      createOrderPostMethod,
    ],
  });

  return api;
}
