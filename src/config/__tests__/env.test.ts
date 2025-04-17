import { getAzureConfig } from "../env";

describe("getAzureConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return connection string when it exists", () => {
    const testConnectionString = "test-connection-string";
    process.env.AZURE_STORAGE_CONNECTION_STRING = testConnectionString;

    const config = getAzureConfig();
    expect(config).toEqual({ connectionString: testConnectionString });
  });

  it("should throw error when connection string is not set", () => {
    delete process.env.AZURE_STORAGE_CONNECTION_STRING;

    expect(() => getAzureConfig()).toThrow(
      "AZURE_STORAGE_CONNECTION_STRING environment variable is not set"
    );
  });
}); 