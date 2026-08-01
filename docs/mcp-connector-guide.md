# AIOrouter MCP Connector — Claude Connector Directory Submission Guide

> **Purpose:** This document is the connector metadata + submission guide for the
> [Claude Connector Directory](https://claude.com) (Claude Desktop / Claude Code /
> Codex CLI connector marketplace).
> **Package:** `@aiorouter/mcp@1.1.1` (published 2026-08-01)
> **Phase 3G** | Agent: AIRO (glm-5.2)

---

## 1. Connector Overview

| Field | Value |
|:---|:---|
| **Name** | AIOrouter MCP Server |
| **Package** | `@aiorouter/mcp` |
| **Version** | 1.1.1 |
| **Category** | AI Model Gateway / Inference Router |
| **One-line description** | Access 15+ AI models (Qwen, DeepSeek, GLM, Kimi, Grok) through a single API key with PII Shield protection. |
| **Long description** | AIOrouter MCP Server gives Claude Desktop / Claude Code / Codex CLI access to 15+ non-Claude AI models through the Model Context Protocol. Send chat completions to Qwen, DeepSeek, GLM, Kimi, Grok and more — while personal information and technical secrets are protected by the PII Shield before routing. Works with your existing AIOrouter API key, same billing and quota. |
| **Author** | AIOrouter |
| **License** | MIT |
| **Homepage** | https://aiorouter.ca |
| **Repository** | https://github.com/aiorouter/aiorouter-mcp |
| **npm** | https://www.npmjs.com/package/@aiorouter/mcp |

## 2. Supported Transports

| Transport | Support | Notes |
|:---|:---|:---|
| **stdio** | ✅ | Local MCP server (`npx @aiorouter/mcp`) — recommended for Claude Desktop / Code |
| **Streamable HTTP** | ✅ | Remote server at `https://api.aiorouter.ca/mcp` (stateless) |

## 3. Authentication Methods

| Method | Transport | Notes |
|:---|:---|:---|
| **API Key** | stdio + HTTP | `AIOROUTER_API_KEY` env var / `Authorization: Bearer ak-...` |
| **OAuth 2.1** | HTTP only | PKCE + Google OAuth; MCP-scoped RS256 tokens (1h access + 7-day refresh rotation) |

## 4. Tool List (10 tools)

| # | Tool | Description | Read-only |
|:---|:---|:---|:---|
| 1 | `aiorouter_chat` | Send a chat completion to any AIOrouter model | No |
| 2 | `aiorouter_list_models` | List all available models with provider info | Yes |
| 3 | `aiorouter_get_presets` | Show CODE-MAS orchestrator triple preset configuration | Yes |
| 4 | `aiorouter_get_pricing` | Get public retail pricing (USD per 1M tokens) | Yes |
| 5 | `aiorouter_get_usage` | Get usage, billing, and subscription status | Yes |
| 6 | `aiorouter_test_connection` | Test API key validity and show account info | Yes |
| 7 | `aiorouter_export_config` | Generate MCP config JSON for Claude Desktop/Code/Codex | Yes |
| 8 | `aiorouter_compare_models` | Compare 2-5 models side-by-side | Yes |
| 9 | `aiorouter_estimate_cost` | Estimate cost for a prompt (input + output tokens) | Yes |
| 10 | `aiorouter_get_model_info` | Get detailed info for a single model | Yes |

## 5. Setup Instructions

### 5.1 Get an API Key

1. Register at https://dashboard.aiorouter.ca/keys
2. Create an API key (format: `ak-...`)
3. The key is used for billing — same key works for MCP tools and direct API calls

### 5.2 Claude Desktop

Edit `claude_desktop_config.json`:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "aiorouter": {
      "command": "npx",
      "args": ["-y", "@aiorouter/mcp"],
      "env": {
        "AIOROUTER_API_KEY": "ak-your-api-key-here"
      }
    }
  }
}
```

### 5.3 Claude Code

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "aiorouter": {
      "command": "npx",
      "args": ["-y", "@aiorouter/mcp"],
      "env": {
        "AIOROUTER_API_KEY": "ak-your-api-key-here"
      },
      "type": "stdio"
    }
  }
}
```

  ### 5.4 Codex CLI

  **Option 1 — Install via Codex Plugin Marketplace (recommended):**

  ```bash
  # Add this repository as a Codex plugin marketplace (once):
  codex plugin marketplace add AIOCANA/aiorouter-mcp

  # Install the plugin:
  codex plugin install aiorouter

  # Set your API key when prompted (or export in your shell):
  export AIOROUTER_API_KEY=ak-your-api-key-here

  # Verify:
  codex mcp list    # → aiorouter with 10 tools
  ```

  **Option 2 — Manual `config.toml`:**

  ```toml
  # ~/.codex/config.toml
  [mcp_servers.aiorouter]
  command = "npx"
  args = ["-y", "@aiorouter/mcp"]
  env = { AIOROUTER_API_KEY = "ak-your-api-key-here" }
  ```

### 5.5 Remote HTTP (optional)

```
URL: https://api.aiorouter.ca/mcp
Auth: Authorization: Bearer ak-your-api-key (or OAuth 2.1)
```

## 6. Tool Schema Reference

All 10 tools follow the MCP protocol tool schemas. Example — `aiorouter_chat`:

```json
{
  "name": "aiorouter_chat",
  "title": "AIOrouter Chat",
  "description": "Send a chat completion to any AIOrouter model (Qwen, DeepSeek, GLM, Kimi, Grok, etc). Non-streaming only (MCP limitation). Increase max_tokens (up to 8192) for long responses.",
  "inputSchema": {
    "model": "string",
    "messages": [
      { "role": "user|assistant|system", "content": "string (max 32768)" }
    ],
    "max_tokens": "number (1-8192, default 8192)",
    "temperature": "number (0-2, default 0.7)"
  }
}
```

Full schemas are exposed at runtime via MCP `tools/list`.

## 7. Security & Compliance

- **PII Shield:** Personal information and technical secrets are protected before routing to any model
- **API Key Safety:** API key stays in the environment variable — never written to disk by the package
- **HTTPS Only:** All communication with AIOrouter uses HTTPS
- **No Package Secrets:** The npm package contains zero API keys, tokens, or credentials
- **OAuth Isolation:** MCP OAuth uses a separate Google OAuth client + separate JWT signing key from the Dashboard

## 8. Verification Checklist (before Directory submission)

- [x] `@aiorouter/mcp@1.1.1` published on npm
- [x] 10 tools registered (verified via `tools/list`)
- [x] MIT license included
- [x] README with Quick Start + per-client setup
- [x] Security review passed (15 secret scans, zero leaks)
- [x] npm org `aiorouter` owned by AIOrouter (FOUNDER `tayachu`)
- [x] **MCP protocol smoke test passed** (Phase 3H — `scripts/mcp-smoke-test.mjs`, 5/5 PASS)
- [x] **Public GitHub repo `AIOCANA/aiorouter-mcp` LIVE** (`834300d`, 26 files, governance hooks installed)
- [x] **Independent adversarial review complete** (12 findings: 7 fixed + 5 documented)
- [x] **Privacy Policy drafted** (`docs/privacy-policy.md` — must be deployed to an HTTPS URL)
- [ ] **Remote MCP submission portal** (needs Team/Enterprise Claude.ai org) OR **Desktop extension (MCPB)**
- [ ] **Icon/logo** at https://aiorouter.ca/logo.png
- [ ] **Test account** for reviewer + end-to-end access instructions
- [ ] Connector metadata submitted to Claude Connector Directory

## 9. Claude Connector Directory Submission

> **Source:** Anthropic official Connectors Directory documentation (confirmed 2026-08-01) — submission is NOT a public self-serve portal; it goes through official channels.

### 9.1 Submission channels (by connector type)

| Type | Channel | Prerequisites |
|:---|:---|:---|
| **Remote MCP server** (`https://api.aiorouter.ca/mcp`) | Claude.ai submission portal: `https://claude.ai/admin-settings/directory/submissions/new` | **Requires a Team/Enterprise Claude.ai org** + Directory management permission (individual plans have no admin settings) |
| **Desktop extension (MCPB)** | Separate form: `https://clau.de/desktop-extention-submission` | No portal required; package the local stdio server as an MCP Bundle |

> ⚠️ **AIOrouter is dual-mode (remote + local).** Remote submission requires a Team/Enterprise org (FOUNDER decision); alternatively package `npx @aiorouter/mcp` as an MCPB and use the Desktop extension channel.

### 9.2 Submission requirements (our status)

| Requirement | AIOrouter status |
|:---|:---|
| **Security** | ✅ PII Shield + HTTPS + 15 secret scans passed |
| **Tool annotations** (title + readOnlyHint/destructiveHint) | ✅ All 10 tools compliant (9 readOnly + chat destructiveHint) |
| **Authentication** | ✅ OAuth 2.1 (custom OAuthServerProvider + MCP-scoped tokens) — Remote |
| **Privacy Policy** | ✅ `docs/privacy-policy.md` created — use canonical URL `https://aiorouter.ca/docs/legal/privacy-policy` (live) or deploy to a new HTTPS URL |
| **Documentation** | ✅ Public repo `github.com/AIOCANA/aiorouter-mcp` README |

### 9.3 Portal submission fields (Remote path)

| Step | Content | AIOrouter readiness |
|:---|:---|:---|
| Connection | Server URL (https) + transport (streamable HTTP) | `https://api.aiorouter.ca/mcp` |
| Tools | Auto-sync 10 tools (grouped by readOnly/write) | ✅ compliant |
| Listing | name / tagline(55) / description(2000) / categories / docs URL / privacy URL / support contact / icon / slug (permanent) | FOUNDER to fill |
| Use cases | Primary use cases + prerequisites (account/plan) | **Requires a paid AIOrouter account + API key** (no free tier — D2 policy; API keys only issued after registration + payment) |
| Company | Company name / website / contact | AIOrouter / aiorouter.ca |
| Authentication | OAuth (dynamic client registration) | ✅ OAuth 2.1 |
| Data handling | Whether the API is your own | ✅ First-party API |
| Test & launch | **Test account + end-to-end instructions** (reviewer must be able to connect) | ⚠️ FOUNDER to provide test account |
| Compliance | 7 policy acknowledgments | FOUNDER to confirm each |
| Review | Final read-through + submit | — |

### 9.4 Suggested Listing content (draft)

- **Connector name:** AIOrouter MCP
- **Tagline:** Access 15+ AI models through a single API key with PII Shield privacy
- **Description:** Gives Claude access to 15+ non-Claude models (Qwen, DeepSeek, GLM, Kimi, Grok) through a single API key, with PII Shield protecting personal information and technical secrets. Includes 10 MCP tools: chat, model listing, pricing, usage, cost estimation, and more.
- **Categories:** AI Models / Developer Tools
- **Documentation URL:** https://github.com/AIOCANA/aiorouter-mcp
- **Privacy Policy URL:** https://aiorouter.ca/docs/legal/privacy-policy (canonical, live; or deploy `docs/privacy-policy.md` to a new URL)
- **Icon:** https://aiorouter.ca/logo.png (to prepare)
- **Support contact:** support@aiorouter.ca
- **Slug:** aiorouter-mcp (permanent)

### 9.5 FOUNDER pre-submission checklist

1. ⚠️ **Decide Remote vs MCPB path** (Remote needs a Team/Enterprise Claude.ai org)
2. 📄 Deploy the Privacy Policy to an HTTPS URL (use `docs/privacy-policy.md`)
3. 🖼 Prepare an icon (https://aiorouter.ca/logo.png)
4. 🔑 Prepare a test account + end-to-end access instructions (for the reviewer)
5. ✅ Test all tools with MCP Inspector or a custom connector
6. 📝 Confirm the 7 compliance policy acknowledgments

---

## 10. MCPB Desktop Extension Bundle (2026-08-01 ✅ BUILT)

**Decision:** Ship MCPB first (zero cost); submit the Remote portal after stable income justifies upgrading to Claude.ai Team.

**Bundle:** `dist/mcpb/aiorouter-mcp.mcpb` (5.5 kB, valid ZIP)

```
Contents:
  manifest.json  (manifest_version 0.2.0 + privacy_policies array)
  README.md      (with mandatory "Privacy Policy" section)
  icon.png       (public/images/brand/logo-nav.png)
  server:        npx -y @aiorouter/mcp  (no node_modules bundled — lightweight)
```

**Quick use (4 ways, simplest first):**
```
Way 1 One-click:  download aiorouter-mcp.mcpb → double-click → Claude Desktop auto-installs
Way 2 Zero-install: npx -y @aiorouter/mcp (existing path)
Way 3 Manual:      add mcpServers to claude_desktop_config.json
Way 4 Advanced:     download from the public repo + install via CLI
```

**Rebuild (after updates):**
```bash
node scripts/build-mcpb.mjs        # rebuild dist/mcpb/aiorouter-mcp.mcpb
node scripts/verify-mcpb.mjs       # verify ZIP format + entries
```

**Submit (Desktop extension form `https://clau.de/desktop-extention-submission`):**
1. Use canonical privacy URL `https://aiorouter.ca/docs/legal/privacy-policy` (live) or deploy `docs/privacy-policy.md` to a new URL
2. Fill the form: connector name / description / privacy URL / icon / bundle
3. (Optional) validate format with the official `mcpb` CLI

---

## Phase 3H: MCP Protocol Verification

### Primary method — self-contained smoke test (recommended)

```powershell
$env:AIOROUTER_API_KEY="ak-..."
node scripts/mcp-smoke-test.mjs
```

Verifies over stdio JSON-RPC:
- `initialize` → protocol 2025-06-18
- `notifications/initialized`
- `tools/list` → 10 tools
- `tools/call aiorouter_test_connection` → real API key → connection OK

### Optional — official conformance suite

```powershell
npx -y @modelcontextprotocol/conformance@latest --help   # check actual CLI flags first
# then run with the flags reported (flags vary by version)
```

> ⚠️ The official conformance CLI flags (e.g. `--transport`) are unstable across versions —
> run `--help` first. The smoke test is the reliable zero-dependency verification.
