# AIOrouter MCP Connector — Privacy Policy

> **Applies to:** `@aiorouter/mcp` (npm package) and the AIOrouter Remote MCP Server (`https://api.aiorouter.ca/mcp`)
> **Effective date:** 2026-08-01
> **Version:** 1.0

## 1. Data Collection

The AIOrouter MCP Connector collects the following data:

| Data Category | Description | Necessity |
|:---|:---|:---|
| **API Key** | User-provided `AIOROUTER_API_KEY`, stored in a local environment variable; **never written to disk by the package, never transmitted to the npm registry** | Required — authentication and billing |
| **Conversation content** | Messages sent via `aiorouter_chat` (user prompts and model responses) | Required — AI model inference |
| **Usage / billing data** | Call counts, token usage, subscription status (read via the API) | Required — quota and billing |
| **Account identity** (OAuth) | Google email + user ID (only when OAuth 2.1 is used) | Required — account binding and billing bridge |

**We do NOT collect:** user files (unless explicitly sent via `aiorouter_chat`), browsing history, or other application data.

## 2. Usage and Storage

- Conversation content is used **only to route requests to the AI model you choose** (Qwen, DeepSeek, GLM, Kimi, Grok, etc.) for inference.
- Data is **de-identified by the AIOrouter PII Shield before routing** (personal information and technical secrets are protected first).
- All transmission is **HTTPS-encrypted**.
- Data storage follows the AIOrouter platform data policy (see https://aiorouter.ca/docs/legal/privacy-policy).

## 3. Third-party Sharing

- **AI model providers** (Alibaba, DeepSeek, Zhipu, Moonshot, etc.): receive only the minimal request content needed for inference (after PII Shield de-identification).
- **Anthropic**: only when you configure AIOrouter as Claude Desktop's third-party inference gateway are Claude requests routed through AIOrouter.
- **We do not sell user data.**

## 4. Data Retention

- Data retention follows the AIOrouter platform policy (https://aiorouter.ca/docs/legal/privacy-policy).
- Users can review usage, revoke API keys, or request data deletion at any time at https://dashboard.aiorouter.ca.

## 5. Contact Information

- **Privacy inquiries:** privacy@aiorouter.ca
- **Security inquiries:** security@aiorouter.ca
- **Company:** AIOrouter, https://aiorouter.ca
