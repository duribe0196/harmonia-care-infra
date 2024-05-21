import * as lambdaUtils from "../../lambdas";
import { Provider } from "@pulumi/aws";
import * as cognitoUtils from "../../cognito";
import { createUsersAPIGateway } from "../../api-gateway";
import * as database from "../../database";
import * as secretManagerUtils from "../../secrets-manager";

export interface IUserModuleArgs {
  env: string;
  provider: Provider;
  cognitoSecretName: string;
  dynamoSecretName: string;
  region: string;
  projectName: string;
}

export default function (args: IUserModuleArgs) {
  const {
    env,
    provider,
    cognitoSecretName,
    dynamoSecretName,
    region,
    projectName,
  } = args;

  const { lambda } = lambdaUtils.createLambdaFunction({
    name: `${env}-${projectName}-api-users`,
    resourceName: `${env}-${projectName}-api-users`,
    provider: provider,
    bucketKey: `users-api/code.zip`,
    bucketId: `harmonia-care-code`,
    environment: {
      variables: {
        COGNITO_SECRET_NAME: cognitoSecretName,
        DYNAMODB_SECRET_NAME: dynamoSecretName,
        REGION: region,
      },
    },
    timeout: 5,
    sourceCodeHash: process.env.USERS_S3_OBJECT_HASH,
  });

  const { userPool, userPoolClient } = cognitoUtils.createUserPool({
    userPoolClientName: `${env}-${projectName}-user-pool-client`,
    userPoolName: `${env}-${projectName}-user-pool`,
    trigger: lambda,
  });

  createUsersAPIGateway({
    name: `${env}-${projectName}-users-api-gateway`,
    handler: lambda,
    provider,
    env,
    projectName,
  });

  database.userApiDB.createDynamoDBTables({
    env,
    projectName,
  });

  secretManagerUtils.createCognitoSecrets({
    name: cognitoSecretName,
    resourceName: cognitoSecretName,
    userPoolId: userPool.id,
    userPoolClientId: userPoolClient.id,
    region: region,
  });

  secretManagerUtils.createDynamoSecrets({
    name: dynamoSecretName,
    resourceName: dynamoSecretName,
    region: region,
    tableName: `${env}-${projectName}-otp-codes-table`,
  });

  return { userPool };
}
