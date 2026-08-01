// ── MCP Tools Index ──────────────────────────────────────────────────────
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerChatTool } from "./chat.js";
import { registerListModelsTool } from "./list-models.js";
import { registerTestConnectionTool } from "./test-connection.js";
import { registerGetUsageTool } from "./get-usage.js";
import { registerGetPricingTool } from "./get-pricing.js";
import { registerExportConfigTool } from "./export-config.js";
import { registerCompareModelsTool } from "./compare-models.js";
import { registerEstimateCostTool } from "./estimate-cost.js";
import { registerGetModelInfoTool } from "./get-model-info.js";
import { registerGetPresetsTool } from "./get-presets.js";

  export function registerAllLocalTools(server: McpServer, apiKey: string): number {
    registerChatTool(server, apiKey);
    registerListModelsTool(server, apiKey);
    registerTestConnectionTool(server, apiKey);
    registerGetUsageTool(server, apiKey);
    registerGetPricingTool(server, apiKey);
    registerExportConfigTool(server, apiKey);
    // Phase 3A: P1 tools
    registerCompareModelsTool(server, apiKey);
    registerEstimateCostTool(server, apiKey);
    registerGetModelInfoTool(server, apiKey);
    registerGetPresetsTool(server, apiKey);
    return 10;
  }
