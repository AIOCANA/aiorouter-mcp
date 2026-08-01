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
- [ ] **MCP Conformance test passed** (Phase 3H — see below)
- [ ] Connector metadata submitted to Claude Connector Directory

## 9. Claude Connector Directory Submission

Submit at the Claude Connector Directory connector submission portal:

1. **Connector name:** AIOrouter MCP Server
2. **Category:** AI Model Gateway / Inference Router
3. **Transport:** stdio (primary), Streamable HTTP (secondary)
4. **Auth:** API Key + OAuth 2.1
5. **npm package:** `@aiorouter/mcp`
6. **Icon/logo:** https://aiorouter.ca/logo.png
7. **Documentation link:** https://github.com/aiorouter/aiorouter-mcp (README)
8. **Verification:** Conformance test output (Phase 3H)

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
