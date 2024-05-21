import * as aws from "@pulumi/aws";

interface ICreateSubnetArgs {
  env: string;
  projectName: string;
}

export const createSubnet = (args: ICreateSubnetArgs) => {
  const { env, projectName } = args;
  const vpc = new aws.ec2.Vpc(`${env}-${projectName}-vpc`, {
    cidrBlock: "10.0.0.0/16",
  });

  const subnet = new aws.ec2.Subnet(`${env}-${projectName}-subnet`, {
    vpcId: vpc.id,
    cidrBlock: "10.0.1.0/24",
    availabilityZone: "us-east-1a",
  });

  const securityGroup = new aws.ec2.SecurityGroup(
    `${env}-${projectName}-security-group`,
    {
      vpcId: vpc.id,
      ingress: [
        {
          protocol: "tcp",
          fromPort: 0,
          toPort: 65535,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      egress: [
        {
          protocol: "tcp",
          fromPort: 0,
          toPort: 65535,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
    },
  );

  return { vpc, subnet, securityGroup };
};
