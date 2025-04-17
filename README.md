# Gaia Vault MCP Server 🚀

> 🔌 **Compatible with Cline, Cursor, Claude Desktop, and any other MCP Clients!**
> 
> Gaia Vault MCP is also compatible with any MCP client

The Model Context Protocol (MCP) is an open standard that enables AI systems to interact seamlessly with various data sources and tools, facilitating secure, two-way connections.

The Gaia Vault MCP server provides:

* Seamless interaction with Azure Blob Storage
* Secure file upload and download capabilities
* Efficient blob listing and management
* Type-safe operations with TypeScript

## Prerequisites 🔧

Before you begin, ensure you have:

* Azure Storage Account and Connection String
* Claude Desktop or Cursor
* Node.js (v20 or higher)
* Git installed (only needed if using Git installation method)

## Gaia Vault MCP server installation ⚡

### Running with NPX

```bash
npx -y gaia-vault-mcp@latest
```

### Installing via Smithery

To install Gaia Vault MCP Server for Claude Desktop automatically via Smithery:

```bash
npx -y @smithery/cli install @gaia-vault/mcp --client claude
```

## Configuring MCP Clients ⚙️

### Configuring Cline 🤖

The easiest way to set up the Gaia Vault MCP server in Cline is through the marketplace with a single click:

1. Open Cline in VS Code
2. Click on the Cline icon in the sidebar
3. Navigate to the "MCP Servers" tab (4 squares)
4. Search "Gaia Vault" and click "install"
5. When prompted, enter your Azure Storage connection string

Alternatively, you can manually set up the Gaia Vault MCP server in Cline:

1. Open the Cline MCP settings file:
```bash
# For macOS:
code ~/Library/Application\ Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json

# For Windows:
code %APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

2. Add the Gaia Vault server configuration to the file:
```json
{
  "mcpServers": {
    "gaia-vault-mcp": {
      "command": "npx",
      "args": ["-y", "gaia-vault-mcp@latest"],
      "env": {
        "AZURE_STORAGE_CONNECTION_STRING": "your-connection-string-here"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

3. Save the file and restart Cline if it's already running.

### Configuring Cursor 🖥️

> **Note**: Requires Cursor version 0.45.6 or higher

To set up the Gaia Vault MCP server in Cursor:

1. Open Cursor Settings
2. Navigate to Features > MCP Servers
3. Click on the "+ Add New MCP Server" button
4. Fill out the following information:
   * **Name**: Enter a nickname for the server (e.g., "gaia-vault-mcp")
   * **Type**: Select "command" as the type
   * **Command**: Enter the command to run the server:
   ```bash
   env AZURE_STORAGE_CONNECTION_STRING=your-connection-string npx -y gaia-vault-mcp@latest
   ```
   > **Important**: Replace `your-connection-string` with your Azure Storage connection string

### Configuring the Claude Desktop app 🖥️

#### For macOS:
```bash
# Create the config file if it doesn't exist
touch "$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Opens the config file in TextEdit
open -e "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```

#### For Windows:
```bash
code %APPDATA%\Claude\claude_desktop_config.json
```

#### Add the Gaia Vault server configuration:
```json
{
  "mcpServers": {
    "gaia-vault-mcp": {
      "command": "npx",
      "args": ["-y", "gaia-vault-mcp@latest"],
      "env": {
        "AZURE_STORAGE_CONNECTION_STRING": "your-connection-string-here"
      }
    }
  }
}
```

## Usage in Claude Desktop App 🎯

Once the installation is complete, and the Claude desktop app is configured, you must completely close and re-open the Claude desktop app to see the gaia-vault-mcp server. You should see a hammer icon in the bottom left of the app, indicating available MCP tools.

### Gaia Vault Examples

1. **Upload a File**:
```
Upload the file "report.pdf" to the "documents" container in Azure Blob Storage.
```

2. **Download a File**:
```
Download the file "report.pdf" from the "documents" container to my local machine.
```

3. **List Blobs**:
```
List all files in the "documents" container.
```

## Troubleshooting 🛠️

### Common Issues

1. **Server Not Found**
   * Verify the npm installation by running `npm --version`
   * Check Claude Desktop configuration syntax
   * Ensure Node.js is properly installed by running `node --version`

2. **Connection String Issues**
   * Confirm your Azure Storage connection string is valid
   * Check the connection string is correctly set in the config
   * Verify no spaces or quotes around the connection string

3. **Container Access Issues**
   * Verify the container exists in your Azure Storage account
   * Check the container permissions
   * Ensure the connection string has appropriate access rights

## Acknowledgments ✨

* Model Context Protocol for the MCP specification
* Anthropic for Claude Desktop
* Microsoft Azure for Blob Storage 