"use strict";

import { BlobServiceClient } from "@azure/storage-blob";
import { getAzureConfig } from "../config/env";

export default async (
  containerName: string,
  blobName: string,
  options: { filePath?: string; textContent?: string }
) => {
  const { connectionString } = getAzureConfig();

  if (!options.filePath && !options.textContent) {
    throw new Error("Either filePath or textContent must be provided");
  }

  // Create BlobServiceClient
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  
  // Get container client
  const containerClient = blobServiceClient.getContainerClient(containerName);
  
  // Create container if it doesn't exist
  await containerClient.createIfNotExists();
  
  // Get block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  // Upload based on the provided option
  if (options.filePath) {
    await blockBlobClient.uploadFile(options.filePath);
  } else if (options.textContent) {
    await blockBlobClient.upload(options.textContent, options.textContent.length);
  }
  
  return `Content uploaded successfully. URL: ${blockBlobClient.url}`;
}; 