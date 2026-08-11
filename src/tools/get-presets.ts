// ── aiorouter_get_presets Tool (Phase 3A — P1) ─────────────────────────────
// Local version: calls GET /v1/presets endpoint on the AIOrouter API.
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAiorouterAPI } from "../api-client.js";

export function registerGetPresetsTool(server: McpServer, apiKey: string): void {
  server.registerTool(
    "aiorouter_get_presets",
    {
      title: "Get AIOrouter Presets",
      description:
        "Show the triple preset configuration (planner/coder/reviewer) for CODE-MAS orchestrator.",
      annotations: { readOnlyHint: true },
      inputSchema: {},
    },
    async () => {
      const response = await getAiorouterAPI("/v1/presets", apiKey);
      if (response.error) {
        return {
          content: [{ type: "text" as const, text: `Error: ${response.error.message}` }],
          isError: true,
        };
      }

      const presets = (response as Record<string, unknown>).presets as
        | Record<string, unknown>
        | undefined;

      if (!presets) {
        return {
          content: [{ type: "text" as const, text: "No presets configured." }],
        };
      }

      const lines: string[] = ["📋 AIOrouter Triple Presets\n"];
      for (const [key, val] of Object.entries(presets)) {
        const preset = val as Record<string, unknown>;
        lines.push(
          `─ ${key} (${preset.label ?? key}) ─`,
          `  Planner: ${preset.planner_model}`,
          `  Coder: ${preset.coder_model}`,
          `  Reviewers: ${JSON.stringify(preset.reviewer_by_risk ?? {})}`,
          "",
        );
      }

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
        structuredContent: { presets },
      };
    },
  );
}
