#!/usr/bin/env node
// ── AIOrouter MCP Server — CLI ────────────────────────────────────────────
// Commands: setup, status, version, help, start (default)

import { getAiorouterAPI } from "./api-client.js";
import { VERSION } from "./version.js";

async function runSetup(): Promise<void> {
  console.log("🚀 AIOrouter MCP Server Setup\n");
  console.log("Step 1: Get API key → https://dashboard.aiorouter.ca/keys\n");
  console.log("Step 2: Configure your MCP client:\n");
  console.log("┌─ Claude Desktop ──────────────────────────────────────");
  console.log("│ Config file:");
  console.log("│   macOS:   ~/Library/Application Support/Claude/claude_desktop_config.json");
  console.log("│   Windows: %APPDATA%\\Claude\\claude_desktop_config.json");
  console.log("│   Linux:   ~/.config/Claude/claude_desktop_config.json");
  console.log("│");
  console.log('│ {"mcpServers":{"aiorouter":{"command":"npx","args":["-y","@aiorouter/mcp"],"env":{"AIOROUTER_API_KEY":"ak-your-key"}}}}');
  console.log("├─ Claude Code ─────────────────────────────────────────");
  console.log("│ Config file: .mcp.json (project root) or ~/.claude/.mcp.json");
  console.log("│");
  console.log('│ {"mcpServers":{"aiorouter":{"type":"stdio","command":"npx","args":["-y","@aiorouter/mcp"],"env":{"AIOROUTER_API_KEY":"ak-your-key"}}}}');
  console.log("├─ Codex CLI ───────────────────────────────────────────");
  console.log("│ Config: Codex MCP configuration file");
  console.log("│");
  console.log('│ {"mcpServers":{"aiorouter":{"command":"npx","args":["-y","@aiorouter/mcp"],"env":{"AIOROUTER_API_KEY":"ak-your-key"}}}}');
  console.log("└───────────────────────────────────────────────────────\n");
  console.log("Step 3: Restart your MCP client\n");
  console.log("Step 4: Test with: AIOROUTER_API_KEY=ak-... aiorouter-mcp status");
}

async function runStatus(): Promise<void> {
  const apiKey = process.env.AIOROUTER_API_KEY;
  if (!apiKey) { console.log("❌ AIOROUTER_API_KEY not set.\nRun: aiorouter-mcp setup"); process.exit(1); }
  console.log("🔍 Checking API key...");
  const r = await getAiorouterAPI("/v1/models", apiKey);
  if (r.error) { console.log(`❌ Connection failed: ${r.error.message}\nCheck: https://dashboard.aiorouter.ca/keys`); process.exit(1); }
  console.log(`✅ Connected! ${Array.isArray(r.data) ? r.data.length : "?"} models available.\nDashboard: https://dashboard.aiorouter.ca`);
}

async function main(): Promise<void> {
  const cmd = process.argv[2]?.toLowerCase();
  switch (cmd) {
    case "setup": await runSetup(); break;
    case "status": await runStatus(); break;
    case "version": case "--version": case "-v": console.log(`@aiorouter/mcp v${VERSION}`); break;
    case "help": case "--help": case "-h":
      console.log("AIOrouter MCP Server\n\nUsage: aiorouter-mcp [command]\n\nCommands:\n  (none)    Start MCP server\n  setup     Setup guide\n  status    Check connection\n  version   Show version\n  help      This help\n\nEnv: AIOROUTER_API_KEY\nKeys: https://dashboard.aiorouter.ca/keys");
      break;
    default:
      if (cmd) { console.error(`Unknown: ${cmd}\nRun: aiorouter-mcp help`); process.exit(1); }
      await import("./index.js");
  }
}

main().catch((e) => { console.error("Fatal:", e instanceof Error ? e.message : e); process.exit(1); });
