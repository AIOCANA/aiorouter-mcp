// ── aiorouter_export_config Tool ─────────────────────────────────────────
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerExportConfigTool(server: McpServer, _apiKey: string): void {
  server.registerTool("aiorouter_export_config", {
    title: "Export AIOrouter Config",
      description: `Generate MCP configuration JSON for Claude Desktop, Claude Code, or Codex CLI.`,
      annotations: { readOnlyHint: true },
    inputSchema: {
        target: z.enum(["claude_desktop", "claude_desktop_local", "claude_code", "codex"]).describe("Target client"),
    },
  }, async ({ target }) => {
    const baseServer = { command: "npx", args: ["-y", "@aiorouter/mcp"], env: { AIOROUTER_API_KEY: "<your-api-key-here>" } };
    let config: unknown;
    let instructions: string;

      switch (target) {
        case "claude_desktop":
          config = { mcpServers: { aiorouter: baseServer } };
          instructions = "Add to: ~/Library/Application Support/Claude/claude_desktop_config.json\n(Windows: %APPDATA%\\Claude\\claude_desktop_config.json)";
          break;
        case "claude_desktop_local":
          config = {
            mcpServers: {
              aiorouter: {
                command: "node",
                args: ["dist/mcp-server/index.js"],
                env: { AIOROUTER_API_KEY: "<your-api-key-here>" },
              },
            },
          };
          instructions = "Local development config (uses compiled dist/mcp-server/index.js).\n" +
            "Save to your Claude Desktop config:\n" +
            "  Windows: %APPDATA%\\Claude\\claude_desktop_config.json\n" +
            "  macOS:   ~/Library/Application Support/Claude/claude_desktop_config.json\n" +
            "  Linux:   ~/.config/Claude/claude_desktop_config.json\n\n" +
            "After saving, restart Claude Desktop and check for 🔨 tool icon.\n" +
            "Or use: node tooling/claude-desktop-doctor.mjs fix --api-key YOUR_KEY";
          break;
      case "claude_code":
        config = { mcpServers: { aiorouter: { ...baseServer, type: "stdio" } } };
        instructions = "Add to .mcp.json in project root, or ~/.claude/.mcp.json";
        break;
      case "codex":
        config = { mcpServers: { aiorouter: baseServer } };
        instructions = "Add to Codex CLI MCP configuration.";
        break;
    }

    return {
      content: [{ type: "text" as const, text: `📋 Config for ${target}:\n\n${JSON.stringify(config, null, 2)}\n\n📝 ${instructions}\n\nGet key: https://dashboard.aiorouter.ca/keys` }],
      structuredContent: { target, config, instructions },
    };
  });
}
