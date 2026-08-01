// ── aiorouter_compare_models Tool (Phase 3A — P1) ────────────────────────
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAiorouterAPI } from "../api-client.js";

interface ModelEntry {
  id: string;
  owned_by?: string;
  context_length?: number;
  max_completion_tokens?: number;
  pricing?: { prompt?: string; completion?: string; completion_thinking?: string };
  capabilities?: {
    streaming?: boolean;
    function_calling?: boolean;
    reasoning?: boolean;
    vision?: boolean;
    json_mode?: string;
  };
}

export function registerCompareModelsTool(server: McpServer, apiKey: string): void {
  server.registerTool(
    "aiorouter_compare_models",
    {
      title: "Compare AIOrouter Models",
      description:
        "Compare 2-5 AIOrouter models side-by-side: provider, pricing, context window, max output, and capabilities.",
      annotations: { readOnlyHint: true },
      inputSchema: {
        models: z
          .array(z.string())
          .min(2)
          .max(5)
          .describe("Model IDs to compare (2-5)"),
      },
    },
    async ({ models: modelIds }) => {
      const response = await getAiorouterAPI("/v1/models", apiKey);
      if (response.error) {
        return {
          content: [{ type: "text" as const, text: `Error: ${response.error.message}` }],
          isError: true,
        };
      }

      const allModels = (response.data as ModelEntry[]) ?? [];
      const requested = modelIds as string[];
      const found: ModelEntry[] = [];
      const missing: string[] = [];

      for (const id of requested) {
        const match = allModels.find(
          (m) => m.id === id || m.id.toLowerCase() === id.toLowerCase(),
        );
        if (match) {
          found.push(match);
        } else {
          missing.push(id);
        }
      }

      if (found.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `None of the requested models were found: ${requested.join(", ")}. Use aiorouter_list_models to see available models.`,
            },
          ],
          isError: true,
        };
      }

      const lines: string[] = ["📊 Model Comparison\n"];
      for (const m of found) {
        const cap = m.capabilities;
        const p = m.pricing;
        lines.push(
          `─ ${m.id} ─`,
          `  Provider: ${m.owned_by ?? "unknown"}`,
          `  Context: ${m.context_length ?? "?"} tokens`,
          `  Max output: ${m.max_completion_tokens ?? "?"} tokens`,
          `  Pricing: ${p?.prompt ?? "?"} input / ${p?.completion ?? "?"} output (per token)`,
          `  Capabilities: streaming=${cap?.streaming ?? "?"}, function_calling=${cap?.function_calling ?? "?"}, reasoning=${cap?.reasoning ?? "?"}, vision=${cap?.vision ?? "?"}, json_mode=${cap?.json_mode ?? "?"}`,
          "",
        );
      }

      if (missing.length > 0) {
        lines.push(`⚠️ Not found: ${missing.join(", ")}`);
      }

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
        structuredContent: { compared: found, not_found: missing },
      };
    },
  );
}
