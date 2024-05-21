import * as aws from "@pulumi/aws";

interface ICreateDynamoDBTable {
  env: string;
  projectName: string;
}

export function createDynamoDBTables(args: ICreateDynamoDBTable) {
  const { env, projectName } = args;
  const otpCodesTableName = `${env}-${projectName}-otp-codes-table`;
  return new aws.dynamodb.Table(`${env}-${projectName}-dynamo-db-otp-codes`, {
    name: otpCodesTableName,
    billingMode: "PAY_PER_REQUEST",
    hashKey: "email",
    attributes: [
      {
        name: "email",
        type: "S",
      },
      {
        name: "OTPCode",
        type: "S",
      },
    ],
    globalSecondaryIndexes: [
      {
        name: "OTPCodeIndex",
        hashKey: "OTPCode",
        projectionType: "ALL",
      },
    ],
    ttl: {
      attributeName: "TimeToExist",
      enabled: true,
    },
    tags: {
      Environment: env,
    },
  });
}
