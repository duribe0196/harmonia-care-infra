import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { lambdaRole } from "../roles/roles";

type Environment = {
  variables: {
    [key: string]: string | pulumi.Output<string>;
  };
};

interface CreateLambdaParams {
  name: string;
  resourceName: string;
  bucketId: string;
  bucketKey: string;
  provider: pulumi.ProviderResource;
  environment?: Environment;
  dependsOn?: any[];
  timeout?: number;
  sourceCodeHash?: string;
}

export function createLambdaFunction(args: CreateLambdaParams) {
  const {
    name,
    bucketId,
    provider,
    bucketKey,
    environment,
    resourceName,
    dependsOn,
    timeout = 3,
    sourceCodeHash,
  } = args;
  let lambdaConfig: aws.lambda.FunctionArgs = {
    name: name,
    runtime: "nodejs18.x",
    handler: "index.handler",
    role: lambdaRole.arn,
    s3Bucket: bucketId,
    s3Key: bucketKey,
    timeout: timeout,
    ...(environment && { environment }),
    ...(sourceCodeHash && { sourceCodeHash }),
  };

  const lambda = new aws.lambda.Function(resourceName, lambdaConfig, {
    provider,
    replaceOnChanges: ["environment"],
    ...(dependsOn && { dependsOn }),
  });

  return { lambda };
}
