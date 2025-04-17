import { BlobServiceClient } from "@azure/storage-blob";
import * as fs from "fs";
import * as path from "path";
import { getAzureConfig } from "../config/env";

export default async (
  containerName: string,
  blobName: string,
  options: { pathFile?: string; asText?: boolean }
) => {
  const { connectionString } = getAzureConfig();

  // Create BlobServiceClient
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  
  // Get container client
  const containerClient = blobServiceClient.getContainerClient(containerName);
  
  // Get block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  // Check if blob exists
  const exists = await blockBlobClient.exists();
  if (!exists) {
    throw new Error(`Blob ${blobName} does not exist in container ${containerName}`);
  }
  
  if (!options.pathFile && !options.asText) {
    throw new Error("Either pathFile or asText must be provided");
  }

  if (options.pathFile) {
    // Ensure directory exists
    const dir = path.dirname(options.pathFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Download to file
    await blockBlobClient.downloadToFile(options.pathFile);
    return `File downloaded successfully to: ${options.pathFile}`;
  } else {
    // Download as text
    const downloadResponse = await blockBlobClient.download();
    const downloadedContent = await streamToString(downloadResponse.readableStreamBody);
    return downloadedContent;
  }
};

// Helper function to convert stream to string
async function streamToString(readableStream: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    readableStream.on("data", (data: any) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
} 