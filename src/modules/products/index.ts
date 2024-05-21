import * as lambdaUtils from "../../lambdas";
import * as vpcUtils from "../../vpc";
import { createServicesAPIGateway } from "../../api-gateway";
import * as database from "../../database";
import { Provider } from "@pulumi/aws";
import * as aws from "@pulumi/aws";
import * as secretManagerUtils from "../../secrets-manager";
import { Output } from "@pulumi/pulumi";

export interface IServiceModuleArgs {
  env: string;
  provider: Provider;
  cognitoSecretName: string;
  dynamoSecretName: string;
  region: string;
  userPool: aws.cognito.UserPool;
  mongoAtlasOrgId: string;
  projectName: string;
  mongodbSecretName: string;
  mongodbPassword: Output<string>;
}

export default function (args: IServiceModuleArgs) {
  const {
    region,
    env,
    provider,
    dynamoSecretName,
    userPool,
    mongoAtlasOrgId,
    projectName,
    mongodbSecretName,
    mongodbPassword,
  } = args;

  const { securityGroup, subnet } = vpcUtils.createSubnet({ env, projectName });
  const name = `${env}-${projectName}-lambda-services`;
  const { lambda } = lambdaUtils.createLambdaFunction({
    name: name,
    resourceName: name,
    provider: provider,
    bucketKey: `products-api/code.zip`,
    bucketId: `harmonia-care-code`,
    environment: {
      variables: {
        DYNAMODB_SECRET_NAME: dynamoSecretName,
        REGION: region,
      },
    },
    timeout: 5,
    sourceCodeHash: process.env.PRODUCTS_S3_OBJECT_HASH,
    subnet,
    securityGroup,
  });

  createServicesAPIGateway({
    name: `${env}-${projectName}-products-api-gateway`,
    handler: lambda,
    provider: provider,
    userPool: userPool,
    env: env,
    projectName,
  });

  const { dbUser, connectionString, clusterName, projectId } =
    database.servicesApiDB.createMongoAtlasCluster({
      mongoAtlasOrgId,
      env,
      region,
      projectName,
      mongodbPassword,
    });

  secretManagerUtils.createMongoDBSecrets({
    name: mongodbSecretName,
    resourceName: mongodbSecretName,
    region: region,
    projectId,
    connectionString,
    dbPassword: mongodbPassword,
    clusterName,
    dbUser,
  });
}
