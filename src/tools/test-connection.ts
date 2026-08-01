// ── aiorouter_test_connection Tool ───────────────────────────────────────
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAiorouterAPI } from "../api-client.js";

export function registerTestConnectionTool(server: McpServer, apiKey: string): void {
  server.registerTool("aiorouter_test_connection", {
    title: "Test AIOrouter Connection",
      description: `Test whether your AIOrouter API key is valid.`,
      annotations: { readOnlyHint: true },
      inputSchema: {},
  }, async () => {
    const response = await getAiorouterAPI("/v1/models", apiKey);
    if (response.error) {
      return {
        content: [{ type: "text" as const, text: `❌ Connection failed: ${response.error.message}\n\nCheck your key at: https://dashboard.aiorouter.ca/keys` }],
        isError: true,
      };
    }
    const count = Array.isArray(response.data) ? response.data.length : 0;
    return {
      content: [{ type: "text" as const, text: `✅ Connection successful! ${count} models available.\nDashboard: https://dashboard.aiorouter.ca` }],
      structuredContent: { status: "connected", model_count: count },
    };
  });
}
