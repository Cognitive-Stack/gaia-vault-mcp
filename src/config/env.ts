"use strict";

export const getAzureConfig = () => {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING environment variable is not set");
  }
  return { connectionString };
}; 