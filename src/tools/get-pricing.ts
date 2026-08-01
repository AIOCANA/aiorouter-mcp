// ── aiorouter_get_pricing Tool ───────────────────────────────────────────
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAiorouterAPI } from "../api-client.js";

export function registerGetPricingTool(server: McpServer, apiKey: string): void {
  server.registerTool("aiorouter_get_pricing", {
    title: "Get AIOrouter Pricing",
      description: `Get public retail pricing for AIOrouter models (USD per 1M tokens).`,
      annotations: { readOnlyHint: true },
    inputSchema: {
      model: z.string().optional().describe("Specific model ID (optional)"),
    },
  }, async ({ model }) => {
    const response = await getAiorouterAPI("/v1/models", apiKey);
    if (response.error) {
      return { content: [{ type: "text" as const, text: `Error: ${response.error.message}` }], isError: true };
    }
    const models = (response.data as Array<{ id: string; pricing?: { input?: number; output?: number } }>) ?? [];
    let filtered = models;
    if (model) filtered = models.filter(m => m.id.toLowerCase().includes(model.toLowerCase()));
      if (filtered.length === 0) {
        return { content: [{ type: "text" as const, text: `No pricing found. Use aiorouter_list_models to see available models.` }] };
      }
    const lines: string[] = ["💰 AIOrouter Model Pricing (USD/1M tokens):\n"];
    for (const m of filtered.slice(0, 20)) {
      const p = m.pricing;
      if (p) {
        lines.push(`  ${m.id}: Input $${p.input?.toFixed(2) ?? "?"} | Output $${p.output?.toFixed(2) ?? "?"}`);
      } else {
        lines.push(`  ${m.id} — see dashboard`);
      }
    }
    lines.push(`\nFull pricing: https://aiorouter.ca/pricing`);
    return { content: [{ type: "text" as const, text: lines.join("\n") }], structuredContent: { models: filtered, count: filtered.length } };
  });
}
