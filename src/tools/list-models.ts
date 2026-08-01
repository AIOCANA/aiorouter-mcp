// ── aiorouter_list_models Tool ───────────────────────────────────────────
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAiorouterAPI } from "../api-client.js";

export function registerListModelsTool(server: McpServer, apiKey: string): void {
  server.registerTool("aiorouter_list_models", {
    title: "List AIOrouter Models",
      description: `List all available AI models through AIOrouter. Filter by provider name.`,
      annotations: { readOnlyHint: true },
    inputSchema: {
      provider: z.string().optional().describe("Filter by provider name (e.g., 'deepseek', 'qwen', 'glm')"),
    },
  }, async ({ provider }) => {
    const response = await getAiorouterAPI("/v1/models", apiKey);
    if (response.error) {
      return { content: [{ type: "text" as const, text: `Error: ${response.error.message}` }], isError: true };
    }
    const models = (response.data as Array<{ id: string; [key: string]: unknown }>) ?? [];
    let filtered = models;
    if (provider) {
      const p = provider.toLowerCase();
      filtered = filtered.filter(m => m.id.toLowerCase().includes(p));
    }
    const list = filtered.map(m => `- ${m.id}`).join("\n");
    return {
      content: [{ type: "text" as const, text: `Available models (${filtered.length}):\n\n${list}` }],
      structuredContent: { models: filtered, count: filtered.length },
    };
  });
}
