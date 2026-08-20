// ── aiorouter_get_usage Tool ─────────────────────────────────────────────
// Shows token usage and billing balance.
// Falls back to dashboard link if /v1/usage endpoint is unavailable.

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAiorouterAPI } from "../api-client.js";

export function registerGetUsageTool(server: McpServer, apiKey: string): void {
  server.registerTool("aiorouter_get_usage", {
    title: "Get AIOrouter Usage & Billing",
      description: `Get current usage and billing balance for your API key.`,
      annotations: { readOnlyHint: true },
      inputSchema: {},
  }, async () => {
    const response = await getAiorouterAPI("/v1/usage", apiKey);
    if (response.error) {
      return {
        content: [{ type: "text" as const, text: `Usage & billing details: https://dashboard.aiorouter.ca/billing\n\nView token consumption and Top-Up balance there.` }],
      };
    }
    const u = response as Record<string, unknown>;
    const lines = ["📊 AIOrouter Usage & Billing\n"];
    // Legacy fields retained for grandfathered subscribers; Top-Up users see balance only.
    if (u.subscription_plan !== undefined && u.subscription_plan !== null) lines.push(`Plan: ${u.subscription_plan}`);
    if (u.subscription_status !== undefined && u.subscription_status !== null) lines.push(`Status: ${u.subscription_status}`);
    if (u.total_tokens !== undefined && u.total_tokens !== null) lines.push(`Total tokens: ${u.total_tokens}`);
    if (u.period_usage !== undefined && u.period_usage !== null) lines.push(`Period usage: ${u.period_usage} tokens`);
    if (u.remaining_balance !== undefined && u.remaining_balance !== null) lines.push(`Balance: $${u.remaining_balance}`);
    if (u.topup_balance !== undefined && u.topup_balance !== null) lines.push(`Top-up: $${u.topup_balance}`);
    if (lines.length === 2) lines.push("(no usage data available yet)");
    lines.push(`\nFull details: https://dashboard.aiorouter.ca/billing`);
    return { content: [{ type: "text" as const, text: lines.join("\n") }], structuredContent: u };
  });
}
