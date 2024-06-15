import * as lambdaUtils from "../../lambdas";
import { Provider } from "@pulumi/aws";
import * as cognitoUtils from "../../cognito";
import { createUsersAPIGateway } from "../../api-gateway";
import * as secretManagerUtils from "../../secrets-manager";

export interface IUserModuleArgs {
  env: string;
  provider: Provider;
  cognitoSecretName: string;
  mongodbSecretName: string;
  region: string;
  projectName: string;
}

export default function (args: IUserModuleArgs) {
  const {
    env,
    provider,
    cognitoSecretName,
    mongodbSecretName,
    region,
    projectName,
  } = args;

  const name = `${env}-${projectName}-lambda-users`;
  const { lambda } = lambdaUtils.createLambdaFunction({
    name: name,
    resourceName: name,
    provider: provider,
    bucketKey: `users-api/code.zip`,
    bucketId: `harmonia-care-code`,
    environment: {
      variables: {
        COGNITO_SECRET_NAME: cognitoSecretName,
        MONGODB_SECRET_NAME: mongodbSecretName,
        REGION: region,
      },
    },
    timeout: 10,
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

  secretManagerUtils.createCognitoSecrets({
    name: cognitoSecretName,
    resourceName: cognitoSecretName,
    userPoolId: userPool.id,
    userPoolClientId: userPoolClient.id,
    region: region,
  });

  return { userPool };
}
