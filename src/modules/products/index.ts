import * as lambdaUtils from "../../lambdas";
import * as vpcUtils from "../../vpc";
import { createServicesAPIGateway } from "../../api-gateway";
import { Provider } from "@pulumi/aws";
import * as aws from "@pulumi/aws";

export interface IServiceModuleArgs {
  env: string;
  provider: Provider;
  cognitoSecretName: string;
  region: string;
  userPool: aws.cognito.UserPool;
  projectName: string;
  mongodbSecretName: string;
}

export default function (args: IServiceModuleArgs) {
  const { region, env, provider, userPool, projectName, mongodbSecretName } =
    args;

  vpcUtils.createSubnet({ env, projectName });
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

  createServicesAPIGateway({
    name: `${env}-${projectName}-products-api-gateway`,
    handler: lambda,
    provider: provider,
    userPool: userPool,
    env: env,
    projectName,
  });
}
