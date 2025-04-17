import { BlobServiceClient } from "@azure/storage-blob";
import { getAzureConfig } from "../config/env";

export default async (containerName: string) => {
  const { connectionString } = getAzureConfig();

  // Create BlobServiceClient
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  
  // Get container client
  const containerClient = blobServiceClient.getContainerClient(containerName);
  
  // Check if container exists
  const exists = await containerClient.exists();
  if (!exists) {
    throw new Error(`Container ${containerName} does not exist`);
  }

  // List blobs
  const blobs: Array<{
    name: string;
    size: number | undefined;
    lastModified: Date | undefined;
    contentType: string | undefined;
  }> = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    blobs.push({
      name: blob.name,
      size: blob.properties.contentLength,
      lastModified: blob.properties.lastModified,
      contentType: blob.properties.contentType,
    });
  }

  return JSON.stringify(blobs, null, 2);
};