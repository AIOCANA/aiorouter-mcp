# AIOrouter — Codex Plugin

Access **15+ AI models** (Qwen, DeepSeek, GLM, Kimi, Grok) through a single API key with **PII Shield privacy protection** — right inside Codex CLI.

> ⚠️ **PAID service — no free tier.** Requires an active AIOrouter account + API key from https://dashboard.aiorouter.ca/keys

## What you get — 10 MCP tools

| # | Tool | Description |
|:---|:---|:---|
| 1 | `aiorouter_chat` | Send a chat completion to any AIOrouter model |
| 2 | `aiorouter_list_models` | List all available models with provider info |
| 3 | `aiorouter_get_presets` | Show orchestrator triple preset configuration |
| 4 | `aiorouter_get_pricing` | Get public retail pricing (USD per 1M tokens) |
| 5 | `aiorouter_get_usage` | Get usage, billing, and subscription status |
| 6 | `aiorouter_test_connection` | Test API key validity |
| 7 | `aiorouter_export_config` | Generate MCP config JSON for Claude/Codex |
| 8 | `aiorouter_compare_models` | Compare 2-5 models side-by-side |
| 9 | `aiorouter_estimate_cost` | Estimate cost for a prompt |
| 10 | `aiorouter_get_model_info` | Get detailed info for a single model |

## Install (Codex Plugin)

```bash
# 1. Add the marketplace (once)
codex plugin marketplace add AIOCANA/aiorouter-mcp

# 2. Install the plugin
codex plugin install aiorouter

# 3. Set your API key (when prompted, or export in your shell)
export AIOROUTER_API_KEY=ak-your-key

# 4. Verify
codex mcp list        # should show aiorouter with 10 tools
```

## Manual install (alternative)

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.aiorouter]
command = "npx"
args = ["-y", "@aiorouter/mcp"]
env = { AIOROUTER_API_KEY = "ak-your-key" }
```

## Privacy

See the [AIOrouter Privacy Policy](https://aiorouter.ca/docs/legal/privacy-policy).
Prompts sent via `aiorouter_chat` are de-identified by the PII Shield before
routing to any model provider. **Zero prompt retention** — prompts exist in
memory only during request processing.

## License

MIT — see the repository for details.
