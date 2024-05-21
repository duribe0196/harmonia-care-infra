import * as aws from "@pulumi/aws";

const lambdaPolicy = aws.iam.getPolicyDocument({
  statements: [
    {
      effect: "Allow",
      principals: [
        {
          type: "Service",
          identifiers: ["lambda.amazonaws.com"],
        },
      ],
      actions: ["sts:AssumeRole"],
    },
  ],
});

export const lambdaRole = new aws.iam.Role("lambda-role", {
  assumeRolePolicy: lambdaPolicy.then((assumeRole) => assumeRole.json),
});

new aws.iam.RolePolicyAttachment("write-cloud-watch-logs", {
  role: lambdaRole.name,
  policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

new aws.iam.RolePolicyAttachment("cognito-power-user-role-attachment", {
  role: lambdaRole.name,
  policyArn: "arn:aws:iam::aws:policy/AmazonCognitoPowerUser",
});

new aws.iam.RolePolicyAttachment("secrets-manager", {
  role: lambdaRole.name,
  policyArn: "arn:aws:iam::aws:policy/SecretsManagerReadWrite",
});

new aws.iam.RolePolicyAttachment("lambda-dynamodb-full-access", {
  role: lambdaRole.name,
  policyArn: "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
});

new aws.iam.RolePolicyAttachment("lambda-ses-full-access", {
  role: lambdaRole.name,
  policyArn: "arn:aws:iam::aws:policy/AmazonSESFullAccess",
});
