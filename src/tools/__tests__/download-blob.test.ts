import downloadBlob from "../download-blob";
import { BlobServiceClient } from "@azure/storage-blob";

jest.mock("@azure/storage-blob");
jest.mock("../../config/env", () => ({
  getAzureConfig: jest.fn().mockReturnValue({
    connectionString: "test-connection-string",
  }),
}));

describe("downloadBlob", () => {
  const mockContainerClient = {
    getBlockBlobClient: jest.fn(),
  };

  const mockBlockBlobClient = {
    exists: jest.fn(),
    downloadToFile: jest.fn(),
    download: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue(mockContainerClient),
    });
    mockContainerClient.getBlockBlobClient.mockReturnValue(mockBlockBlobClient);
    // Set default mock behavior for exists() to return true
    mockBlockBlobClient.exists.mockResolvedValue(true);
    // Set default mock behavior for download() to return a readable stream
    mockBlockBlobClient.download.mockResolvedValue({
      readableStreamBody: {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === "data") callback("test content");
          if (event === "end") callback();
          return { on: jest.fn() };
        }),
      },
    });
  });

  it("should throw error when neither pathFile nor asText is provided", async () => {
    await expect(
      downloadBlob("test-container", "test-blob", {})
    ).rejects.toThrow("Either pathFile or asText must be provided");

    // Verify no Azure operations were attempted
    expect(mockBlockBlobClient.exists).toHaveBeenCalledTimes(1);
    expect(mockBlockBlobClient.downloadToFile).not.toHaveBeenCalled();
    expect(mockBlockBlobClient.download).not.toHaveBeenCalled();
  });

  it("should throw error when blob does not exist", async () => {
    // Override default mock behavior for this specific test
    mockBlockBlobClient.exists.mockResolvedValue(false);

    await expect(
      downloadBlob("test-container", "non-existent-blob", {
        pathFile: "test-file.txt",
      })
    ).rejects.toThrow("Blob non-existent-blob does not exist in container test-container");

    expect(mockBlockBlobClient.exists).toHaveBeenCalledTimes(1);
    expect(mockBlockBlobClient.downloadToFile).not.toHaveBeenCalled();
  });

  it("should check if blob exists before downloading", async () => {
    mockBlockBlobClient.downloadToFile.mockResolvedValue(undefined);

    await downloadBlob("test-container", "test-blob", {
      pathFile: "test-file.txt",
    });

    expect(mockBlockBlobClient.exists).toHaveBeenCalledTimes(1);
  });

  it("should download to file when pathFile is provided", async () => {
    mockBlockBlobClient.downloadToFile.mockResolvedValue(undefined);

    const result = await downloadBlob("test-container", "test-blob", {
      pathFile: "test-file.txt",
    });

    expect(mockBlockBlobClient.exists).toHaveBeenCalled();
    expect(mockBlockBlobClient.downloadToFile).toHaveBeenCalledWith("test-file.txt");
    expect(result).toBe("File downloaded successfully to: test-file.txt");
  });

  it("should download as text when asText is true", async () => {
    const result = await downloadBlob("test-container", "test-blob", {
      asText: true,
    });

    expect(mockBlockBlobClient.exists).toHaveBeenCalled();
    expect(mockBlockBlobClient.download).toHaveBeenCalled();
    expect(result).toBe("test content");
  });
}); 