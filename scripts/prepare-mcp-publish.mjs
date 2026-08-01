#!/usr/bin/env node
// ── Prepare dist/mcp-server/ for npm publish ───────────────────────────────
//
// Copies the publish manifest files (package.json, README.md, LICENSE) from
// src/mcp-server/ into dist/mcp-server/ (the shared-tsconfig output directory).
//
// Shared tsconfig (Option A): compiled JS lands at project-root/dist/mcp-server/,
// but the npm manifest lives in src/mcp-server/. This script bridges the gap so
// `npm publish` can run directly from dist/mcp-server/.
//
// Usage: node scripts/prepare-mcp-publish.mjs
// After: cd dist/mcp-server && npm publish --access public
//
// Phase 3F | Agent: AIRO (glm-5.2)

import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "src", "mcp-server");
const dst = join(root, "dist", "mcp-server");

mkdirSync(dst, { recursive: true });

const files = ["package.json", "README.md", "LICENSE"];

for (const f of files) {
  copyFileSync(join(src, f), join(dst, f));
  console.log(`✅ copied ${f} → dist/mcp-server/${f}`);
}

console.log("\nPublish directory ready at dist/mcp-server/.");
console.log("\nNext steps (FOUNDER):");
console.log("  cd dist/mcp-server");
console.log("  npm publish --access public");
