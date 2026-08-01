# Changelog

All notable changes to `@aiorouter/mcp` are documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/), versioning follows [SemVer](https://semver.org/).

## [1.1.1] — 2026-08-01

### Fixed
- Startup log now reports the correct tool count (`Tools: 10 registered`) — previously hardcoded to 6. The count is now derived dynamically from `registerAllLocalTools()`.

## [1.1.0] — 2026-08-01

### Added
- **P1 tools (Remote + Local):**
  - `aiorouter_compare_models` — compare 2-5 models side-by-side
  - `aiorouter_estimate_cost` — estimate prompt cost from public retail pricing
  - `aiorouter_get_model_info` — detailed single-model info
  - `aiorouter_get_presets` (Local) — CODE-MAS triple preset configuration
- **`GET /v1/presets`** gateway endpoint to back `aiorouter_get_presets`
- Total tool count: **6 → 10**

### Changed
- Package version 1.0.0 → 1.1.0
- `bin`/`main` paths corrected for the shared-tsconfig (Option A) layout

## [1.0.0] — 2026-07-31

### Added
- Initial npm package release
- **P0 tools (Local + Remote):**
  - `aiorouter_chat` — chat completion to any AIOrouter model
  - `aiorouter_list_models` — list models with provider info
  - `aiorouter_get_pricing` — public retail pricing
  - `aiorouter_get_usage` — usage, billing, subscription status
  - `aiorouter_test_connection` — API key validity check
  - `aiorouter_export_config` — MCP config generator
- stdio + Streamable HTTP transports
- MIT license
