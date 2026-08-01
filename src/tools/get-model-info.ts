// ── aiorouter_get_model_info Tool (Phase 3A — P1) ──────────────────────────
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAiorouterAPI } from "../api-client.js";

interface ModelEntry {
  id: string;
  name?: string;
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
  supported_parameters?: string[];
  architecture?: {
    input_modalities?: string[];
    output_modalities?: string[];
    tokenizer?: string;
  };
}

export function registerGetModelInfoTool(server: McpServer, apiKey: string): void {
  server.registerTool(
    "aiorouter_get_model_info",
    {
      title: "Get AIOrouter Model Info",
      description:
        "Get detailed info for a single AIOrouter model: provider, context window, max output, capabilities, pricing, and supported parameters.",
      annotations: { readOnlyHint: true },
      inputSchema: {
        model: z.string().describe("Model ID (e.g., 'deepseek-v4-pro')"),
      },
    },
    async ({ model }) => {
      const response = await getAiorouterAPI(
        `/v1/models/${encodeURIComponent(model as string)}`,
        apiKey,
      );
      if (response.error) {
        return {
          content: [{ type: "text" as const, text: `Error: ${response.error.message}` }],
          isError: true,
        };
      }

      // /v1/models/:modelId returns the model object directly
      const entry = (response.data as ModelEntry | undefined) ??
        (response as unknown as ModelEntry);

      if (!entry || !entry.id) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Model '${model}' not found. Use aiorouter_list_models to see available models.`,
            },
          ],
          isError: true,
        };
      }

      const cap = entry.capabilities;
      const pricing = entry.pricing;
      const lines: string[] = [
        `📋 Model: ${entry.id}\n`,
        `Display name: ${entry.name ?? "N/A"}`,
        `Provider: ${entry.owned_by ?? "unknown"}`,
        `Context window: ${entry.context_length ?? "?"} tokens`,
        `Max output: ${entry.max_completion_tokens ?? "?"} tokens`,
      ];

      if (cap) {
        lines.push(
          "\nCapabilities:",
          `  streaming: ${cap.streaming}`,
          `  function_calling: ${cap.function_calling}`,
          `  reasoning: ${cap.reasoning}`,
          `  vision: ${cap.vision}`,
          `  json_mode: ${cap.json_mode}`,
        );
      }

      if (pricing) {
        lines.push(
          "\nPricing (per token USD):",
          `  Input: ${pricing.prompt ?? "N/A"}`,
          `  Output: ${pricing.completion ?? "N/A"}`,
        );
      }

      if (entry.supported_parameters && entry.supported_parameters.length > 0) {
        lines.push(`\nSupported parameters: ${entry.supported_parameters.join(", ")}`);
      }

      if (entry.architecture) {
        lines.push(
          `\nArchitecture:`,
          `  Input modalities: ${entry.architecture.input_modalities?.join(", ") ?? "N/A"}`,
          `  Output modalities: ${entry.architecture.output_modalities?.join(", ") ?? "N/A"}`,
          `  Tokenizer: ${entry.architecture.tokenizer ?? "N/A"}`,
        );
      }

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
        structuredContent: entry as unknown as Record<string, unknown>,
      };
    },
  );
}
