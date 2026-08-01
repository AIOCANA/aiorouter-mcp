# Contributing

Thanks for your interest in contributing to `@aiorouter/mcp`!

## Important scope note

This is the **public, sanitized package repo** for the AIOrouter MCP server. It
contains only the MCP client/server package. The AIOrouter gateway backend
(routing, billing, PII Shield pipeline, infrastructure) is **proprietary** and
lives in a separate private repository.

**Please do not open PRs or issues requesting access to proprietary backend code,
internal pricing, or infrastructure details** — those are not part of this project.

## Development setup

```bash
npm install
npm run build      # tsc → dist/
npm test:smoke     # MCP protocol smoke test
```

## How to contribute

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feat/your-feature`
3. **Make changes** — follow existing code style (strict TypeScript, ESM)
4. **Build & test**: `npm run build && npm test:smoke`
5. **Commit**: use clear, descriptive commit messages
6. **Push & open a Pull Request** describing your change

## Code style

- Strict TypeScript (`strict: true`), NodeNext ESM modules
- All MCP tools registered via `registerXTool(server, apiKey)` pattern in `src/tools/`
- No secrets, keys, or internal endpoints in code — read config from `AIOROUTER_API_KEY` env
- No `console.log` in library code (use `console.error` for diagnostics)

## License

By contributing you agree that your contributions are licensed under the [MIT License](./LICENSE).
