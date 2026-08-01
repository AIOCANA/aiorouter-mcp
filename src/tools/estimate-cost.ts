// ── aiorouter_estimate_cost Tool (Phase 3A — P1) ──────────────────────────
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAiorouterAPI } from "../api-client.js";

interface ModelEntry {
  id: string;
  pricing?: { prompt?: string; completion?: string };
}

export function registerEstimateCostTool(server: McpServer, apiKey: string): void {
  server.registerTool(
    "aiorouter_estimate_cost",
    {
      title: "Estimate AIOrouter Cost",
      description:
        "Estimate the cost (USD) for a prompt given model, input tokens, and output tokens. Uses public retail pricing.",
      annotations: { readOnlyHint: true },
      inputSchema: {
        model: z.string().describe("Model ID (e.g., 'deepseek-v4-pro')"),
        input_tokens: z
          .number()
          .int()
          .min(0)
          .describe("Estimated input (prompt) tokens"),
        output_tokens: z
          .number()
          .int()
          .min(0)
          .optional()
          .default(0)
          .describe("Estimated output (completion) tokens"),
      },
    },
    async ({ model, input_tokens, output_tokens }) => {
      // Fetch model detail to get per-token pricing
      const response = await getAiorouterAPI(`/v1/models/${encodeURIComponent(model)}`, apiKey);
      if (response.error) {
        return {
          content: [{ type: "text" as const, text: `Error: ${response.error.message}` }],
          isError: true,
        };
      }

      const modelData = response.data as ModelEntry | undefined;
      // /v1/models/:modelId returns the model object directly (not wrapped in a list)
      const entry = modelData ?? (response as unknown as ModelEntry);
      const pricing = entry?.pricing;

      if (!pricing || !pricing.prompt || !pricing.completion) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Model '${model}' pricing not available. Use aiorouter_get_pricing for available pricing data.`,
            },
          ],
          isError: true,
        };
      }

      // Pricing fields are per-token USD strings (e.g., "0.000000435")
      const inputPerToken = parseFloat(pricing.prompt);
      const outputPerToken = parseFloat(pricing.completion);

      if (!Number.isFinite(inputPerToken) || !Number.isFinite(outputPerToken)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Model '${model}' has unparseable pricing data.`,
            },
          ],
          isError: true,
        };
      }

      const inTokens = input_tokens as number;
      const outTokens = (output_tokens as number) ?? 0;

      const inputCost = inTokens * inputPerToken;
      const outputCost = outTokens * outputPerToken;
      const totalCost = inputCost + outputCost;

      const lines: string[] = [
        "💰 Cost Estimate\n",
        `Model: ${model}`,
        `Input:  ${inTokens.toLocaleString()} tokens × $${inputPerToken.toFixed(12)}/token = $${inputCost.toFixed(6)}`,
        `Output: ${outTokens.toLocaleString()} tokens × $${outputPerToken.toFixed(12)}/token = $${outputCost.toFixed(6)}`,
        `Total:  $${totalCost.toFixed(6)} USD`,
      ];

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
        structuredContent: {
          model,
          input_tokens: inTokens,
          output_tokens: outTokens,
          input_cost_usd: Number(inputCost.toFixed(6)),
          output_cost_usd: Number(outputCost.toFixed(6)),
          total_cost_usd: Number(totalCost.toFixed(6)),
          pricing_source: "GET /v1/models/:modelId (public retail)",
        },
      };
    },
  );
}
