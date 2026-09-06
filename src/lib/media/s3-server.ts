import "server-only";

import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

/**
 * Server-only Supabase Storage S3 interface.
 * Never import this module from Client Components.
 */
export type StorageS3Config = {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  forcePathStyle: boolean;
};

export function readStorageS3Config(): StorageS3Config | null {
  const endpoint =
    process.env.SUPABASE_S3_ENDPOINT ??
    process.env.S3_ENDPOINT ??
    null;
  const accessKeyId =
    process.env.SUPABASE_S3_ACCESS_KEY_ID ??
    process.env.S3_ACCESS_KEY_ID ??
    null;
  const secretAccessKey =
    process.env.SUPABASE_S3_SECRET_ACCESS_KEY ??
    process.env.S3_SECRET_ACCESS_KEY ??
    null;
  const region =
    process.env.SUPABASE_S3_REGION ?? process.env.S3_REGION ?? "us-west-2";

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return {
    endpoint,
    region,
    accessKeyId,
    secretAccessKey,
    forcePathStyle: true,
  };
}

export function createStorageS3Client() {
  const config = readStorageS3Config();
  if (!config) {
    throw new Error(
      "Supabase Storage S3 credentials are not configured on the server.",
    );
  }
  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

export async function headStorageObject(bucket: string, path: string) {
  const client = createStorageS3Client();
  return client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: path,
    }),
  );
}

export async function deleteStorageObjectViaS3(bucket: string, path: string) {
  const client = createStorageS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: path,
    }),
  );
}

export function storageS3Configured() {
  return readStorageS3Config() != null;
}
