import * as aws from "@pulumi/aws";

import { ProviderResource } from "@pulumi/pulumi";

interface CreateBucketParams {
  name: string;
  provider: ProviderResource;
}

export function createBucket(args: CreateBucketParams) {
  const { name, provider } = args;
  return new aws.s3.Bucket(
    name,
    {
      bucket: name,
    },
    { provider: provider },
  );
}

interface GetBucketParams {
  name: string;
}
export async function getBucket(
  args: GetBucketParams,
): Promise<aws.s3.GetBucketResult> {
  const { name } = args;
  return await aws.s3.getBucket({
    bucket: name,
  });
}

interface GetBucketObjectParams {
  bucketName: string;
  objectKey: string;
}
export async function getBucketObject(
  args: GetBucketObjectParams,
): Promise<aws.s3.GetBucketObjectResult> {
  const { bucketName, objectKey } = args;
  return await aws.s3.getBucketObject({
    bucket: bucketName,
    key: objectKey,
  });
}
