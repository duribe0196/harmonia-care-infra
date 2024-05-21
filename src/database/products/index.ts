import * as mongodbatlas from "@pulumi/mongodbatlas";
import { Output } from "@pulumi/pulumi";

interface ICreateMongoAtlasClusterArgs {
  env: string;
  mongoAtlasOrgId: string;
  region: string;
  projectName: string;
  mongodbPassword: Output<string>;
}

export function createMongoAtlasCluster(args: ICreateMongoAtlasClusterArgs) {
  const { env, mongoAtlasOrgId, region, projectName, mongodbPassword } = args;
  const project = new mongodbatlas.Project(
    `${env}-${projectName}-mongodb-atlas-project`,
    {
      name: `${env}-${projectName}-mongodb-atlas-project`,
      orgId: mongoAtlasOrgId,
    },
  );

  const ipAccessList = new mongodbatlas.ProjectIpAccessList(
    `${env}-${projectName}-project-ip-access`,
    {
      projectId: project.id,
      cidrBlock: "10.0.1.0/24", // Range de IPs VPC/Subnet
      comment: "Access from Lambda VPC",
    },
  );

  const clusterName = `${env}-${projectName}-mongodb-atlas-cluster`;
  const cluster = new mongodbatlas.Cluster(clusterName, {
    projectId: project.id,
    providerName: "TENANT",
    backingProviderName: "AWS",
    providerRegionName: region.toUpperCase().replace(/-/g, "_"),
    providerInstanceSizeName: "M0",
  });

  const dbUser = new mongodbatlas.DatabaseUser(
    `${env}-${projectName}-mongodb-user`,
    {
      projectId: project.id,
      username: `${env}-${projectName}-mongodb-user`,
      password: mongodbPassword,
      roles: [
        {
          roleName: "readWrite",
          databaseName: "admin",
        },
      ],
      authDatabaseName: "admin",
    },
  );

  return {
    projectId: project.id,
    clusterName: cluster.name,
    connectionString: cluster.connectionStrings[0].standardSrv,
    dbUser: dbUser.username,
    dbPassword: dbUser.password,
    ipAccessList,
  };
}
