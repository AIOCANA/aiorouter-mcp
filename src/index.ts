// ── AIOrouter MCP Server — stdio entry point ─────────────────────────────
// Usage: AIOROUTER_API_KEY=ak-... npx @aiorouter/mcp

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllLocalTools } from "./tools/index.js";
import { VERSION } from "./version.js";

async function main(): Promise<void> {
  const apiKey = process.env.AIOROUTER_API_KEY;
  if (!apiKey) {
    console.error("Error: AIOROUTER_API_KEY is required.");
    console.error("Get your key: https://dashboard.aiorouter.ca/keys");
    console.error("Usage: AIOROUTER_API_KEY=ak-... npx @aiorouter/mcp");
    process.exit(1);
  }

    const server = new McpServer(
      { name: "aiorouter-mcp", version: VERSION },
      { capabilities: { tools: {} } }
    );
    const toolCount = registerAllLocalTools(server, apiKey);

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error(`AIOrouter MCP Server v${VERSION} started`);
    console.error(`Key: ak-***...***${apiKey.slice(-2)}`);
    console.error(`Tools: ${toolCount} registered`);
}

main().catch((error) => {
  console.error("Fatal:", error instanceof Error ? error.message : error);
  process.exit(1);
});
