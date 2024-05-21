import * as aws from "@pulumi/aws";

interface ICreateDynamoSecrets {
  region: string;
  name: string;
  resourceName: string;
  tableName: string;
}

export function createDynamoSecrets(args: ICreateDynamoSecrets) {
  const { resourceName, name, tableName } = args;

  const dynamoSecret = new aws.secretsmanager.Secret(name, {
    name: resourceName,
    description: "Stores dynamodb secrets",
  });

  const dynamoDetails = JSON.stringify({ otpCodesTableName: tableName });

  new aws.secretsmanager.SecretVersion(`${name}-version`, {
    secretId: dynamoSecret.id,
    secretString: dynamoDetails,
  });

  return { dynamoSecret };
}
