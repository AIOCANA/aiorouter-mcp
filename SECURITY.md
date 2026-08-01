# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in `@aiorouter/mcp`, please report it
privately — **do not open a public issue**.

**Email:** security@aiorouter.ca

Please include:
- Affected version(s)
- Steps to reproduce
- Impact description
- (If possible) a proof-of-concept

You should receive a response within **48 hours**. We appreciate responsible
disclosure and will credit researchers who report valid issues (unless anonymity
is requested).

## Scope

This repository covers the **MCP server package** (`@aiorouter/mcp`). The AIOrouter
gateway backend is proprietary and hosted separately — vulnerabilities in the
backend API should be reported via the same contact.

## What this package does NOT contain

This public package is intentionally sanitized:
- **No API keys, tokens, or secrets** — the package reads `AIOROUTER_API_KEY` from the environment
- **No internal infrastructure** — only the public `api.aiorouter.ca` endpoint is referenced
- **No proprietary backend logic** — routing, billing, and PII Shield internals are not in this repo

## Supported Versions

| Version | Supported |
|:---|:---|
| 1.1.x | ✅ |
| 1.0.x | ❌ (superseded) |

## Disclosure Timeline

- **0-48h:** Initial triage and acknowledgement
- **1 week:** Fix developed and tested
- **2-4 weeks:** Fix released (coordinated disclosure)
