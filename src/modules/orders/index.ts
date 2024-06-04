import * as lambdaUtils from "../../lambdas";
import { createOrdersAPIGateway } from "../../api-gateway";
import { Provider } from "@pulumi/aws";
import * as aws from "@pulumi/aws";

export interface IOrdersModuleArgs {
  env: string;
  provider: Provider;
  cognitoSecretName: string;
  region: string;
  userPool: aws.cognito.UserPool;
  projectName: string;
  mongodbSecretName: string;
}

export default function (args: IOrdersModuleArgs) {
  const { region, env, provider, userPool, projectName, mongodbSecretName } =
    args;

  const name = `${env}-${projectName}-lambda-orders`;
  const { lambda } = lambdaUtils.createLambdaFunction({
    name: name,
    resourceName: name,
    provider: provider,
    bucketKey: `orders-api/code.zip`,
    bucketId: `harmonia-care-code`,
    environment: {
      variables: {
        MONGODB_SECRET_NAME: mongodbSecretName,
        REGION: region,
      },
    },
    timeout: 5,
    sourceCodeHash: process.env.ORDERS_S3_OBJECT_HASH,
  });

  createOrdersAPIGateway({
    name: `${env}-${projectName}-orders-api-gateway`,
    handler: lambda,
    provider: provider,
    userPool: userPool,
    env: env,
    projectName,
  });
}
