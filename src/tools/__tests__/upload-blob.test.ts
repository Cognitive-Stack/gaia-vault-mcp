import uploadBlob from "../upload-blob";
import { BlobServiceClient } from "@azure/storage-blob";

jest.mock("@azure/storage-blob");
jest.mock("../../config/env", () => ({
  getAzureConfig: jest.fn().mockReturnValue({
    connectionString: "test-connection-string",
  }),
}));

describe("uploadBlob", () => {
  const mockContainerClient = {
    createIfNotExists: jest.fn(),
    getBlockBlobClient: jest.fn(),
  };

  const mockBlockBlobClient = {
    uploadFile: jest.fn(),
    upload: jest.fn(),
    url: "test-url",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue(mockContainerClient),
    });
    mockContainerClient.getBlockBlobClient.mockReturnValue(mockBlockBlobClient);
  });

  it("should upload file when filePath is provided", async () => {
    const result = await uploadBlob("test-container", "test-blob", {
      filePath: "test-file.txt",
    });

    expect(mockContainerClient.createIfNotExists).toHaveBeenCalled();
    expect(mockBlockBlobClient.uploadFile).toHaveBeenCalledWith("test-file.txt");
    expect(result).toBe("Content uploaded successfully. URL: test-url");
  });

  it("should upload text content when textContent is provided", async () => {
    const result = await uploadBlob("test-container", "test-blob", {
      textContent: "test content",
    });

    expect(mockContainerClient.createIfNotExists).toHaveBeenCalled();
    expect(mockBlockBlobClient.upload).toHaveBeenCalledWith("test content", 12);
    expect(result).toBe("Content uploaded successfully. URL: test-url");
  });

  it("should throw error when neither filePath nor textContent is provided", async () => {
    await expect(
      uploadBlob("test-container", "test-blob", {})
    ).rejects.toThrow("Either filePath or textContent must be provided");
  });
}); 