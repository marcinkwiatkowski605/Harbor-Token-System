# Harbor Token System

A demonstration of a multi-brand design token system. Two brands, one architecture, one source of truth.

## About this project

This project is not a production design system. It's a working proof of concept built to explore and validate the full pipeline from token authoring in Figma through DTCG-compliant JSON to generated CSS output — across multiple brands without duplicating the architecture.

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
tokens.json                Tokens Studio GitHub sync backup
```

## Status

Working. Not production. Built as a learning project to test the full pipeline from Figma to code.

## Tech stack

- **Tokens Studio** for Figma — token authoring
- **DTCG format** — open standard, JSON-based
- **Style Dictionary 4** — multi-platform output
- **@tokens-studio/sd-transforms** — handles Tokens Studio specifics

## Getting started

1. Clone the repository.
2. Open up your terminal and change directories into the root of this repository.
3. Run `npm install` to install all of the packages needed to run thew build.
4. Run `node sd.config.js`. This generates `dist/carentan/tokens.css` and `dist/railyard/tokens.css` — one CSS file per brand, with all token references resolved.

## Architecture

The token system is organized in three layers. Each layer has a specific job, and the layers only communicate in one direction — downward. Component tokens reference semantic tokens. Semantic tokens reference primitives. Primitives hold the raw values.

### Layer 1: Primitive

Raw design values with no meaning attached. A primitive doesn't know if it's a button color or a border. It's just a value.

```json
// Primitive - Carentan.json
"cr-primitive": {
  "color": {
    "neonpink": {
      "600": { "$type": "color", "$value": "#e80064" },
      "700": { "$type": "color", "$value": "#bf0052" }
    }
  },
  "font": {
    "family": {
      "inter": { "$type": "fontFamilies", "$value": "Inter" }
    }
  }
}
```

The project has two brand-specific primitive sets (`Primitive - Carentan` and `Primitive - Railyard`) and one shared global set (`Primitive - Global`) for values that don't change between brands — spacing scale, neutral colors, font sizes, and so on.

### Layer 2: Semantic

This is where raw values get meaning. A semantic token doesn't say "neonpink-600" — it says "this is the default background for brand-colored elements." The same token name exists in both brands, but it resolves to a different primitive depending on which brand is active.

```json
// Semantic - Carentan.json
"cr-semantic": {
  "color": {
    "background": {
      "brand": {
        "default": { "$type": "color", "$value": "{cr-primitive.color.neonpink.600}" },
        "hover":   { "$type": "color", "$value": "{cr-primitive.color.neonpink.700}" }
      }
    }
  }
}
```

```json
// Semantic - Railyard.json
"rd-semantic": {
  "color": {
    "background": {
      "brand": {
        "default": { "$type": "color", "$value": "{rd-primitive.color.blueviolet.600}" },
        "hover":   { "$type": "color", "$value": "{rd-primitive.color.blueviolet.700}" }
      }
    }
  }
}
```

The semantic layer is also where the two brands diverge on decisions like border radius. Carentan uses a progressive scale (2px, 4px, 8px...), giving it a softer feel. Railyard maps everything to 0px — sharp corners throughout.

### Layer 3: Component

Component tokens describe a specific element in a specific state. They don't hold raw values — they reference the semantic layer.

```json
// Component - Carentan.json
"cr-component": {
  "button": {
    "color": {
      "bg": {
        "default": { "$type": "color", "$value": "{cr-semantic.color.background.brand.default}" },
        "hover":   { "$type": "color", "$value": "{cr-semantic.color.background.brand.hover}" }
      }
    },
    "border-radius": {
      "lg": { "$type": "borderRadius", "$value": "{cr-semantic.border-radius.3}" }
    }
  }
}
```

The component layer is identical in structure for both brands. The only difference is the prefix (`cr-component` vs `rd-component`) and which semantic set each brand's tokens point to.

### Why this structure matters

Without the semantic layer, changing a brand color would mean updating every component that uses it directly. With the semantic layer, you change one primitive, and everything that references `color.background.brand.default` updates automatically — buttons, icons, inputs, all of it.

Style Dictionary resolves all these references at build time. The output is flat CSS variables with concrete values. No references survive into production — just resolved colors and sizes, scoped per brand.

```css
/* Carentan output */
--carentan-cr-component-button-color-bg-default: #e80064;

/* Railyard output */
--railyard-rd-component-button-color-bg-default: #9250ee;
```

Same token name. Different brand. Different value. Handled entirely by the architecture.
Each brand has its own primitive, semantic, and component sets. Global primitives are shared.

### A note on brand prefixes

You might notice that brand prefixes appear on every layer — not just semantic, but primitive and component too.

```json
"cr-primitive": { ... }   // Carentan primitive
"rd-primitive": { ... }   // Railyard primitive

"cr-semantic":  { ... }   // Carentan semantic
"rd-semantic":  { ... }   // Railyard semantic

"cr-component": { ... }   // Carentan component
"rd-component": { ... }   // Railyard component
```

In a fully architected system, primitives would typically live in a shared, prefix-free namespace. Brand identity would enter at the semantic layer, where you map a shared role like `color-action-primary` to a brand-specific primitive value. Component tokens would then stay completely brand-agnostic, resolving through semantic tokens automatically.

That's the ideal. In practice, this project uses the free plan of Tokens Studio for Figma, which doesn't include the Advanced Themes feature. Advanced Themes is what enables live brand switching inside Figma — activating a different set of semantic tokens per brand with a single click.

Without it, the workaround is to use named token sets and switch between them manually during export. To make that aliasing unambiguous — and to keep Carentan and Railyard tokens visually separated inside the plugin — each brand's tokens carry a prefix at every layer.

The prefixes add verbosity but don't break the logic. In a production environment with a paid Tokens Studio plan, or with a different toolchain, the prefixes on primitive and component layers would be unnecessary.
