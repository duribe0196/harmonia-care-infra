import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Output } from "@pulumi/pulumi";

interface ICreateCognitoSecrets {
  userPoolId: Output<string>;
  userPoolClientId: Output<string>;
  name: string;
  resourceName: string;
  region: string
}

export function createCognitoSecrets(
  args: ICreateCognitoSecrets
) {
  const {name, resourceName, userPoolId, userPoolClientId} = args
  // Combine the two Outputs into a single structure and then convert into a JSON string
  const cognitoDetails = pulumi
    .all([userPoolId, userPoolClientId])
    .apply(([poolId, clientId]) => {
      return JSON.stringify({
        userPoolId: poolId,
        userPoolClientId: clientId,
      });
    });

  const cognitoSecret = new aws.secretsmanager.Secret(name, {
    name: resourceName,
    description: "Stores Cognito user pool and client IDs",
  });

  new aws.secretsmanager.SecretVersion(`${name}-version`, {
    secretId: cognitoSecret.id,
    secretString: cognitoDetails,
  });

  return { cognitoSecret };
}
