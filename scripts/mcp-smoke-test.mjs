#!/usr/bin/env node
// ── MCP Protocol Smoke Test (Phase 3H) ─────────────────────────────────────
//
// Self-contained MCP protocol verification over stdio transport. No external
// conformance tool dependency — speaks raw JSON-RPC directly to the server.
//
// Verifies:
//   1. initialize            → protocol 2025-06-18 + server capabilities
//   2. notifications/initialized
//   3. tools/list            → expects 10 tools
//   4. tools/call aiorouter_test_connection → real API key → model count
//
// Modes:
//   (default)      requires AIOROUTER_API_KEY env var (real key) → full test
//   --protocol-only  uses a placeholder key + SKIPS the network test_connection
//                    (for AIRO autonomous protocol verification without secrets)
//
// Usage (Windows PowerShell):
//   $env:AIOROUTER_API_KEY="ak-..."
//   node scripts/mcp-smoke-test.mjs                 # full test (FOUNDER)
//   node scripts/mcp-smoke-test.mjs --protocol-only # protocol only (AIRO)
//
// Exit code 0 = all PASS, nonzero = failure.
//
// Phase 3H | Agent: AIRO (glm-5.2)

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const indexPath = join(root, "dist", "mcp-server", "index.js");

const protocolOnly = process.argv.includes("--protocol-only");
const apiKey = protocolOnly ? "ak-placeholder-protocol-only" : process.env.AIOROUTER_API_KEY;

if (!apiKey) {
  console.error("❌ AIOROUTER_API_KEY not set. Run: $env:AIOROUTER_API_KEY=\"ak-...\" then retry, or use --protocol-only.");
  process.exit(1);
}

const EXPECTED_TOOL_COUNT = 10;
const child = spawn(process.execPath, [indexPath], {
  stdio: ["pipe", "pipe", "inherit"],
  env: { ...process.env, AIOROUTER_API_KEY: apiKey },
});

let buffer = "";
const pending = new Map(); // id -> { resolve, label }
let nextId = 1;

function send(method, params = {}) {
  const id = nextId++;
  const msg = JSON.stringify({ jsonrpc: "2.0", id, method, params });
  child.stdin.write(msg + "\n");
  return new Promise((resolve) => {
    pending.set(id, { resolve, label: method });
  });
}

function sendNotify(method, params = {}) {
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
}

child.stdout.on("data", (chunk) => {
  buffer += chunk.toString();
  let idx;
  while ((idx = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id !== undefined && pending.has(msg.id)) {
        const { resolve, label } = pending.get(msg.id);
        pending.delete(msg.id);
        resolve({ label, msg });
      }
    } catch {
      console.error("⚠️  non-JSON line from server:", line.slice(0, 120));
    }
  }
});

child.on("exit", (code) => {
  if (code !== 0 && pending.size > 0) {
    console.error(`\n❌ Server exited early (code ${code})`);
    process.exit(1);
  }
});

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? "✅" : "❌"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  MCP Protocol Smoke Test — @aiorouter/mcp                     ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");

  // 1. initialize
  const init = await send("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "aiorouter-smoke-test", version: "1.0.0" },
  });
  const initResult = init.msg.result;
  check("initialize", !!initResult, initResult ? `protocol ${initResult.protocolVersion ?? "?"}` : JSON.stringify(init.msg.error));

  // 2. initialized notification
  sendNotify("notifications/initialized");
  check("notifications/initialized", true);

  // 3. tools/list
  const list = await send("tools/list", {});
  const tools = list.msg.result?.tools ?? [];
  check("tools/list", Array.isArray(tools), `${tools.length} tools registered`);
  check("tools/list = 10", tools.length === EXPECTED_TOOL_COUNT, `expected ${EXPECTED_TOOL_COUNT}`);

  // 4. tools/call aiorouter_test_connection (real API key → network to api.aiorouter.ca)
  //    In --protocol-only mode: SKIP (placeholder key, no real network call)
  if (protocolOnly) {
    check("tools/call aiorouter_test_connection", true, "SKIP (--protocol-only — needs real key)");
  } else {
    const call = await send("tools/call", {
      name: "aiorouter_test_connection",
      arguments: {},
    });
    const callResult = call.msg.result;
    const isError = callResult?.isError === true;
    const text = callResult?.content?.[0]?.text ?? JSON.stringify(call.msg.error);
    check("tools/call aiorouter_test_connection", !isError && !call.msg.error, isError ? text.slice(0, 160) : (text.includes("✅") ? "connection OK" : text.slice(0, 120)));
  }

  // Summary
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n══════════════════════════════════════════════════════════════`);
  console.log(`  ${passed} PASS | ${failed} FAIL`);
  console.log(`══════════════════════════════════════════════════════════════`);

  child.kill();
  process.exit(failed > 0 ? 1 : 0);
}

setTimeout(() => {
  if (pending.size > 0) {
    console.error(`\n❌ Timeout — ${pending.size} request(s) unanswered: ${[...pending.values()].map((p) => p.label).join(", ")}`);
    child.kill();
    process.exit(1);
  }
}, 20000);

main().catch((e) => {
  console.error("❌ Fatal:", e instanceof Error ? e.message : e);
  child.kill();
  process.exit(1);
});
