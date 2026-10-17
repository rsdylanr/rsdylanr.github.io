# 🧰 Advanced Toolbox

18 client-side tools. Pure HTML/CSS/ES modules. No build step. No backend.

## Tools
- **🧠 Learned Compressor** — side-by-side editor that learns your compressions, exports the dictionary
- **⚡ Rule Compressor** — contractions, abbreviations, fillers, base36 encoding
- **🔀 Dictionary Merger** — merge uploaded dicts, chunk-export by prefix
- **📈 N-gram Miner** — find frequent phrases across pasted text
- **✂️ Bundle Splitter** — split giant HTML into index.html / app.js / styles.css
- **🔍 Diff & Merge** — side-by-side diff with intra-line highlighting
- **🎯 Regex Studio** — build, test, and save regex snippets
- **🌳 AST Visualizer** — interactive JS syntax tree
- **🗜️ Minifier** — Terser-powered JS minification
- **📐 Schema Generator** — JSON → TypeScript / Zod / JSON Schema
- **🔄 Format Converter** — JSON ↔ YAML ↔ CSV
- **💾 SQL Playground** — real SQLite via WASM, import CSV
- **🔐 Crypto Toolkit** — hashes, AES-GCM vault, TOTP, JWT decoder
- **🎨 Palette Lab** — k-means color extraction from any image
- **📱 QR Studio** — styled QR codes, PNG or SVG export
- **⏰ Cron Builder** — build and preview cron expressions
- **📖 Readability** — FK, Fog, SMOG, ARI, CLI scores
- **🕵️ Anonymizer** — redact PII from pasted text

## Deploy
This repo is deployed via `rsdylanr.github.io` — the site lives at https://rsdylanr.github.io/

Every push to `main` updates the live site within ~1 minute.

## Adding new tools
1. Create `tools/my-tool.js`:
   
