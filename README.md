# Harbor Design System

A multi-brand design token system. Two brands, one architecture, one source of truth.

## What this is

A working pipeline that takes design tokens from Figma and turns them into production-ready CSS — separately for each brand. Built to test how DTCG-compliant tokens scale across brands without duplication.

## Architecture

Three layers, in this order:

**Primitive** — raw values. Colors, font families, border radii. One set per brand for brand-specific values, one shared global set for everything else.

**Semantic** — intent. Maps primitive values to roles like `color-action-primary` or `border-radius-3`. This is where brands diverge.

**Component** — usage. Maps semantic tokens to specific component states. Buttons, inputs, selects, textareas.

Each brand has its own primitive, semantic, and component sets. Global primitives are shared.

## Brands

- **Carentan** — pink, Inter, generous corner radii
- **Railyard** — purple, Space Mono, sharp corners

Same architecture. Different decisions.

## Tech stack

- **Tokens Studio** for Figma — token authoring
- **DTCG format** — open standard, JSON-based
- **Style Dictionary 4** — multi-platform output
- **@tokens-studio/sd-transforms** — handles Tokens Studio specifics

## Getting started

```
npm install
node sd.config.js
```

This generates `dist/carentan/tokens.css` and `dist/railyard/tokens.css` — one CSS file per brand, with all token references resolved.

## Project structure

```
tokens/                    Source of truth (DTCG JSON)
  Primitive - Global.json
  Primitive - Carentan.json
  Primitive - Railyard.json
  Semantic - Carentan.json
  Semantic - Railyard.json
  Component - Carentan.json
  Component - Railyard.json
  $themes.json
  $metadata.json

dist/                      Generated output (per brand)
  carentan/tokens.css
  railyard/tokens.css

sd.config.js               Style Dictionary configuration
```

## Why these decisions

**Why three layers?** Because flat tokens don't scale. Without a semantic layer, swapping a brand color means hunting through every component. With it, you change one reference.

**Why separate primitives per brand?** Both brands share the same token names but different values. Same structure, different palette. The semantic layer doesn't care which brand is active — it just resolves to whatever primitive is in scope.

**Why DTCG?** Open standard. Tool-agnostic. Future-proof.

**Why Style Dictionary?** Tool-agnostic too. CSS today, Swift or Kotlin tomorrow without rewriting the source.

## Status

Working. Not production. Built as a learning project to test the full pipeline from Figma to code.
