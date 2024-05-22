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
  dbName: string;
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
    dbName,
  } = args;

  const mongoDBDetails = pulumi
    .all([clusterName, dbUser, dbPassword, connectionString, projectId, dbName])
    .apply(
      ([
        clusterName,
        dbUser,
        dbPassword,
        connectionString,
        projectId,
        dbName,
      ]) => {
        return JSON.stringify({
          clusterName,
          dbUser,
          dbPassword,
          connectionString,
          projectId,
          dbName,
        });
      },
    );

  const mongoSecret = new aws.secretsmanager.Secret(name, {
    name: resourceName,
    description: "Stores mongodb secrets",
  });

  new aws.secretsmanager.SecretVersion(`${name}-version`, {
    secretId: mongoSecret.id,
    secretString: mongoDBDetails,
  });

  return { mongoSecret };
}
