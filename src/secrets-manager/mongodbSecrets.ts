import * as aws from "@pulumi/aws";
import { Output } from "@pulumi/pulumi";
import * as pulumi from "@pulumi/pulumi";

interface ICreateMongoDBSecrets {
  region: string;
  name: string;
  resourceName: string;
  projectId: Output<string>;
  clusterName: Output<string>;
  connectionString: Output<string>;
  dbUser: Output<string>;
  dbPassword: Output<string>;
}

export function createMongoDBSecrets(args: ICreateMongoDBSecrets) {
  const {
    resourceName,
    name,
    clusterName,
    dbUser,
    dbPassword,
    connectionString,
    projectId,
  } = args;

  const mongoSecret = new aws.secretsmanager.Secret(name, {
    name: resourceName,
    description: "Stores mongodb secrets",
  });

  const mongoDBDetails = pulumi
    .all([clusterName, dbUser, dbPassword, connectionString, projectId])
    .apply(([clusterName, dbUser, dbPassword, connectionString, projectId]) => {
      return JSON.stringify({
        clusterName,
        dbUser,
        dbPassword,
        connectionString,
        projectId,
      });
    });

  new aws.secretsmanager.SecretVersion(`${name}-version`, {
    secretId: mongoSecret.id,
    secretString: mongoDBDetails,
  });

  return { mongoSecret };
}
