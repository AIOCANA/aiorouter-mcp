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
- [x] **MCP protocol smoke test passed** (Phase 3H — `scripts/mcp-smoke-test.mjs`, 5/5 PASS)
- [x] **公開 GitHub repo `AIOCANA/aiorouter-mcp` LIVE** (`834300d`, 26 files, governance hooks installed)
- [x] **Independent adversarial review complete** (12 findings: 7 fixed + 5 documented)
- [x] **Privacy Policy drafted** (`docs/privacy-policy.md` — 需上線至 HTTPS URL)
- [ ] **Remote MCP submission portal** (needs Team/Enterprise Claude.ai org) OR **Desktop extension (MCPB)**
- [ ] **Icon/logo** at https://aiorouter.ca/logo.png
- [ ] **Test account** for reviewer + end-to-end access instructions
- [ ] Connector metadata submitted to Claude Connector Directory

## 9. Claude Connector Directory Submission

> **來源:** Anthropic 官方 Connectors Directory 文件（2026-08-01 確認）— 提交非公開自助入口，需經官方管道。

### 9.1 提交管道（依 connector 類型）

| 類型 | 管道 | 前置要求 |
|:---|:---|:---|
| **Remote MCP server**（`https://api.aiorouter.ca/mcp`） | Claude.ai submission portal: `https://claude.ai/admin-settings/directory/submissions/new` | **需 Team/Enterprise Claude.ai 組織** + Directory management 權限（個別方案無 admin settings） |
| **Desktop extension (MCPB)** | 獨立表單: `https://clau.de/desktop-extention-submission` | 不需 portal；本地 stdio server 打包為 MCP Bundle |

> ⚠️ **AIOrouter 是 remote + local 雙型態。** Remote 提交需 Team/Enterprise org（FOUNDER 決策）；或將 `npx @aiorouter/mcp` 打包為 MCPB 走 Desktop extension 管道。

### 9.2 提交要求（我們現況）

| 要求 | AIOrouter 狀態 |
|:---|:---|
| **Security** | ✅ PII Shield + HTTPS + 15 項機密掃描通過 |
| **Tool annotations**（title + readOnlyHint/destructiveHint） | ✅ 10 tools 全部符合（9 readOnly + chat destructiveHint） |
| **Authentication** | ✅ OAuth 2.1（自訂 OAuthServerProvider + MCP-scoped tokens）— Remote 用 |
| **Privacy Policy** | ✅ 已建立 `docs/privacy-policy.md` — 需上傳 HTTPS URL（如 aiorouter.ca/privacy）|
| **Documentation** | ✅ 公開 repo `github.com/AIOCANA/aiorouter-mcp` README |

### 9.3 Portal 提交欄位（Remote 途徑）

| Step | 內容 | AIOrouter 準備 |
|:---|:---|:---|
| Connection | Server URL（https）+ transport（streamable HTTP） | `https://api.aiorouter.ca/mcp` |
| Tools | 自動同步 10 tools（按 readOnly/write 分組） | ✅ 已符合 |
| Listing | name / tagline(55) / description(2000) / categories / docs URL / privacy URL / support contact / icon / slug(永久) | 待 FOUNDER 填寫 |
| Use cases | 主要用途 + 前置需求（帳號/方案） | 需 AIOrouter 帳號 + API key |
| Company | 公司名/網站/聯絡人 | AIOrouter / aiorouter.ca |
| Authentication | OAuth（dynamic client registration）| ✅ OAuth 2.1 |
| Data handling | API 是否自有 | ✅ 自有 API |
| Test & launch | **test 帳號 + 端到端指示**（審查員需能實際連線） | ⚠️ 待 FOUNDER 提供 test account |
| Compliance | 7 項政策確認 | 待 FOUNDER 逐項確認 |
| Review | 最終檢查 + 提交 | — |

### 9.4 建議的 Listing 內容（草稿）

- **Connector name:** AIOrouter MCP
- **Tagline:** Access 15+ AI models through a single API key with PII Shield privacy
- **Description:** 提供 Claude 存取 15+ 非 Claude 模型（Qwen, DeepSeek, GLM, Kimi, Grok），透過單一 API key + PII Shield 保護個人資訊與技術機密。含 chat、模型清單、定價、用量、成本估算等 10 個 MCP tools。
- **Categories:** AI Models / Developer Tools
- **Documentation URL:** https://github.com/AIOCANA/aiorouter-mcp
- **Privacy Policy URL:** https://aiorouter.ca/privacy（需上線 `docs/privacy-policy.md`）
- **Icon:** https://aiorouter.ca/logo.png（需準備）
- **Support contact:** support@aiorouter.ca
- **Slug:** aiorouter-mcp（永久）

### 9.5 提交前 FOUNDER 待辦

1. ⚠️ **決定 Remote vs MCPB 途徑**（Remote 需 Team/Enterprise Claude.ai org）
2. 📄 上線 Privacy Policy 至 HTTPS URL（用 `docs/privacy-policy.md`）
3. 🖼 準備 icon（https://aiorouter.ca/logo.png）
4. 🔑 準備 test account + 端到端存取指示（審查員用）
5. ✅ 用 MCP Inspector 或自訂 connector 實測所有 tools
6. 📝 確認 7 項 Compliance 政策

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
