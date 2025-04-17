import { z } from "zod";
import uploadBlob from "../tools/upload-blob";
import downloadBlob from "../tools/download-blob";
import listBlobs from "../tools/list-blobs";
import { ToolConfig } from "../types/tools";

export const tools: ToolConfig[] = [
  {
    name: "upload-blob",
    description: "Upload content to Azure Blob Storage",
    parameters: z.object({
      containerName: z.string().describe("Name of the Azure Blob container"),
      blobName: z.string().describe("Name of the blob in Azure Storage"),
      filePath: z.string().optional().describe("Path to the file to upload"),
      textContent: z.string().optional().describe("Text content to upload"),
    }),
    execute: async (args: { containerName: string; blobName: string; filePath?: string; textContent?: string }) => {
      if (!args.filePath && !args.textContent) {
        throw new Error("Either filePath or textContent must be provided");
      }
      return await uploadBlob(args.containerName, args.blobName, {
        filePath: args.filePath,
        textContent: args.textContent,
      });
    },
  },
  {
    name: "download-blob",
    description: "Download content from Azure Blob Storage",
    parameters: z.object({
      containerName: z.string().describe("Name of the Azure Blob container"),
      blobName: z.string().describe("Name of the blob in Azure Storage"),
      pathFile: z.string().optional().describe("Local path to save the downloaded file"),
      asText: z.boolean().optional().describe("Whether to return the content as text instead of saving to file"),
    }),
    execute: async (args: { containerName: string; blobName: string; pathFile?: string; asText?: boolean }) => {
      if (!args.pathFile && !args.asText) {
        throw new Error("Either pathFile or asText must be provided");
      }
      return await downloadBlob(args.containerName, args.blobName, {
        pathFile: args.pathFile,
        asText: args.asText,
      });
    },
  },
  {
    name: "list-blobs",
    description: "List all blobs in an Azure Storage container",
    parameters: z.object({
      containerName: z.string().describe("Name of the Azure Blob container"),
    }),
    execute: async (args: { containerName: string }) => {
      return await listBlobs(args.containerName);
    },
  },
]; 