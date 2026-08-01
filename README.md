# @aiorouter/mcp

> AIOrouter MCP Server — Access 15+ AI models through a single API key with PII Shield protection.

[![npm version](https://img.shields.io/npm/v/@aiorouter/mcp.svg)](https://www.npmjs.com/package/@aiorouter/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository contains the **open-source MCP server** (`@aiorouter/mcp`) that gives
Claude Desktop, Claude Code, and Codex CLI access to 15+ non-Claude AI models (Qwen,
DeepSeek, GLM, Kimi, Grok, and more) through the Model Context Protocol.

> ⚠️ **This is the public, sanitized package repo only.** The AIOrouter gateway
> backend (routing, billing, PII Shield pipeline, internal infrastructure) is
> proprietary and is NOT part of this repository.

## Features

- **15+ AI models** — Qwen, DeepSeek, GLM, Kimi, Grok, and more through a single API key
- **MCP Protocol** — Model Context Protocol (stdio transport) for Claude Desktop, Claude Code, and Codex CLI
- **PII Shield** — Personal information and technical secrets are protected before routing
- **10 MCP tools** — Chat, model listing, pricing, usage, cost estimation, and more
- **Zero billing changes** — Same API key, same quota, same billing pipeline as direct API calls

## Quick Start

```bash
export AIOROUTER_API_KEY="ak-your-api-key-here"
npx @aiorouter/mcp
```

Get your API key at [dashboard.aiorouter.ca/keys](https://dashboard.aiorouter.ca/keys).

## Installation

```bash
npm install -g @aiorouter/mcp
# or
npx @aiorouter/mcp
```

## Client Setup

### Claude Desktop

Edit `claude_desktop_config.json`:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "aiorouter": {
      "command": "npx",
      "args": ["-y", "@aiorouter/mcp"],
      "env": { "AIOROUTER_API_KEY": "ak-your-api-key-here" }
    }
  }
}
```

### Claude Code

Add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "aiorouter": {
      "command": "npx",
      "args": ["-y", "@aiorouter/mcp"],
      "env": { "AIOROUTER_API_KEY": "ak-your-api-key-here" },
      "type": "stdio"
    }
  }
}
```

### Codex CLI

```json
{
  "mcpServers": {
    "aiorouter": {
      "command": "npx",
      "args": ["-y", "@aiorouter/mcp"],
      "env": { "AIOROUTER_API_KEY": "ak-your-api-key-here" }
    }
  }
}
```

## Tools (10)

| # | Tool | Description |
|:---|:---|:---|
| 1 | `aiorouter_chat` | Send a chat completion to any AIOrouter model |
| 2 | `aiorouter_list_models` | List all available models with provider info |
| 3 | `aiorouter_get_presets` | Show CODE-MAS orchestrator triple preset configuration |
| 4 | `aiorouter_get_pricing` | Get public retail pricing (USD per 1M tokens) |
| 5 | `aiorouter_get_usage` | Get usage, billing, and subscription status |
| 6 | `aiorouter_test_connection` | Test API key validity and show account info |
| 7 | `aiorouter_export_config` | Generate MCP config JSON for Claude Desktop/Code/Codex |
| 8 | `aiorouter_compare_models` | Compare 2-5 models side-by-side |
| 9 | `aiorouter_estimate_cost` | Estimate cost for a prompt (input + output tokens) |
| 10 | `aiorouter_get_model_info` | Get detailed info for a single model |

## Remote HTTP MCP Server

AIOrouter also provides a Remote HTTP MCP Server at `https://api.aiorouter.ca/mcp`:

- **Transport:** Streamable HTTP (stateless)
- **Auth:** API Key (`Authorization: Bearer ak-...`) or OAuth 2.1
- **Same 10 tools** as the local stdio server

```bash
curl -X POST https://api.aiorouter.ca/mcp \
  -H "Authorization: Bearer ak-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## Development

```bash
# Install deps
npm install

# Build (tsc → dist/)
npm run build

# Protocol smoke test (needs a real API key for full test)
$env:AIOROUTER_API_KEY="ak-..."   # PowerShell
node scripts/mcp-smoke-test.mjs

# Prepare publish dir
npm run publish:prepare
```

See [docs/mcp-connector-guide.md](docs/mcp-connector-guide.md) for the Claude
Connector Directory submission guide.

## Security

- **PII Shield:** Personal information and technical secrets are protected before routing to any model
- **API Key Safety:** Your API key stays in your environment variable — never written to disk
- **HTTPS Only:** All communication with AIOrouter uses HTTPS
- **No Package Secrets:** This npm package contains zero API keys or secrets

Report vulnerabilities via [SECURITY.md](SECURITY.md).

## License

[MIT](./LICENSE)
