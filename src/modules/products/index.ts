import * as lambdaUtils from "../../lambdas";
import { createProductsAPIGateway } from "../../api-gateway";
import { Provider } from "@pulumi/aws";
import * as aws from "@pulumi/aws";

export interface IProductModuleArgs {
  env: string;
  provider: Provider;
  cognitoSecretName: string;
  region: string;
  userPool: aws.cognito.UserPool;
  projectName: string;
  mongodbSecretName: string;
}

export default function (args: IProductModuleArgs) {
  const { region, env, provider, userPool, projectName, mongodbSecretName } =
    args;

  const name = `${env}-${projectName}-lambda-products`;
  const { lambda } = lambdaUtils.createLambdaFunction({
    name: name,
    resourceName: name,
    provider: provider,
    bucketKey: `products-api/code.zip`,
    bucketId: `harmonia-care-code`,
    environment: {
      variables: {
        MONGODB_SECRET_NAME: mongodbSecretName,
        REGION: region,
      },
    },
    timeout: 5,
    sourceCodeHash: process.env.PRODUCTS_S3_OBJECT_HASH,
  });

  createProductsAPIGateway({
    name: `${env}-${projectName}-products-api-gateway`,
    handler: lambda,
    provider: provider,
    userPool: userPool,
    env: env,
    projectName,
  });
}
