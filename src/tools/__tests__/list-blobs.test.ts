import listBlobs from "../list-blobs";
import { BlobServiceClient } from "@azure/storage-blob";

jest.mock("@azure/storage-blob");
jest.mock("../../config/env", () => ({
  getAzureConfig: jest.fn().mockReturnValue({
    connectionString: "test-connection-string",
  }),
}));

describe("listBlobs", () => {
  const mockContainerClient = {
    exists: jest.fn(),
    listBlobsFlat: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue(mockContainerClient),
    });
  });

  it("should return list of blobs when container exists", async () => {
    mockContainerClient.exists.mockResolvedValue(true);
    mockContainerClient.listBlobsFlat.mockReturnValue([
      {
        name: "blob1.txt",
        properties: {
          contentLength: 100,
          lastModified: new Date("2023-01-01"),
          contentType: "text/plain",
        },
      },
      {
        name: "blob2.txt",
        properties: {
          contentLength: 200,
          lastModified: new Date("2023-01-02"),
          contentType: "text/plain",
        },
      },
    ]);

    const result = await listBlobs("test-container");
    const expected = JSON.stringify(
      [
        {
          name: "blob1.txt",
          size: 100,
          lastModified: new Date("2023-01-01"),
          contentType: "text/plain",
        },
        {
          name: "blob2.txt",
          size: 200,
          lastModified: new Date("2023-01-02"),
          contentType: "text/plain",
        },
      ],
      null,
      2
    );

    expect(mockContainerClient.exists).toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  it("should throw error when container does not exist", async () => {
    mockContainerClient.exists.mockResolvedValue(false);

    await expect(listBlobs("test-container")).rejects.toThrow(
      "Container test-container does not exist"
    );
  });
}); 