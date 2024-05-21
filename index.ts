import * as pulumi from "@pulumi/pulumi";
import * as utils from "./src/utils";
import { Input } from "@pulumi/pulumi";
import { Region } from "@pulumi/aws";
import * as infra from "./src/modules";

const env = process.env.PULUMI_ENV;
const awsRegion = process.env.AWS_REGION;
const orgId = process.env.MONGO_ATLAS_ORG_IG;
const mongodbPassword = process.env.MONGODB_PASSWORD;

const awsConfig = new pulumi.Config("aws");
const atlasConfig = new pulumi.Config("atlas");
const region = awsConfig.require("region") || awsRegion;
const mongoAtlasOrgId = atlasConfig.require("orgId") || orgId;
const projectConfig = new pulumi.Config(pulumi.getProject());
const projectName = projectConfig.name;
const dbPassword =
  projectConfig.requireSecret("mongoDBPassword") || mongodbPassword;

if (!env || !region || !mongoAtlasOrgId || !dbPassword) {
  console.error("Please make sure all environment variables are provided");
  process.exit(0);
}

const provider = utils.createProvider(
  region as Input<Region>,
  env,
  projectName,
);
const cognitoSecretName = `${env}-${projectName}cognito-secrets-v2`;
const dynamoSecretName = `${env}-${projectName}-dynamo-secrets-v2`;
const mongodbSecretName = `${env}-${projectName}-mongodb-secrets-v2`;

const { userPool } = infra.runUserModuleInfrastructure({
  env,
  provider,
  cognitoSecretName,
  dynamoSecretName,
  region,
  projectName,
});

infra.runProductsModuleInfrastructure({
  env,
  cognitoSecretName,
  dynamoSecretName,
  region,
  userPool,
  provider,
  mongoAtlasOrgId,
  projectName,
  mongodbSecretName,
  mongodbPassword: dbPassword,
});
