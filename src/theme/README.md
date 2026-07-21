# `src/theme/` — Design tokens (mirrors the "Notely" Figma file)

**Track / owner:** Track 1 — Design + Frontend
**Linear:** [TOP-5](https://linear.app/) (parent), **TOP-6** (design-system foundation)
**Figma source:** the **Notely** file — Variable collections **Primitives** and
**Tokens** (mode "Mode 1").

The code source of truth for Notely's visual language. It mirrors Figma's own
two-layer setup: raw **primitives**, and **semantic tokens** that alias them.
Feature code reads the *semantic* tokens — no inline hex or magic numbers.

## Layers

```
primitives (raw values)         semantic tokens (alias primitives)
  Base   white/black      ─┐      Colors    light/dark roles  (→ Base/Grey)
  Grey   50…900           ─┼──▶   Spacing   0…40              (→ Numbers)
  Numbers 0…64, 1000      ─┘      Radius    none…full         (→ Numbers)
                                  BorderWidth none/default/strong (→ Numbers)
```

## What lives here

| File            | Exports | Layer |
| --------------- | ------- | ----- |
| `primitives.ts` | `Base`, `Grey`, `Numbers`, `Primitives` | primitives (raw Figma "Primitives") |
| `colors.ts`     | `Colors` (light/dark), `ThemeColor` | semantic |
| `spacing.ts`    | `Spacing` (keyed by px: `Spacing[16]`), `SpacingToken` | semantic (Figma "Spacing") |
| `radii.ts`      | `Radius` (`Radius.large`…), `RadiusToken` | semantic (Figma "Radius") |
| `border.ts`     | `BorderWidth`, `BorderWidthToken` | semantic (Figma "Border") |
| `typography.ts` | `Fonts` | (no Figma type tokens yet) |
| `layout.ts`     | `BottomTabInset`, `MaxContentWidth` | app constants (not Figma) |
| `figma/`        | raw DTCG exports (`*.tokens.json`) | source artifacts |
| `index.ts`      | barrel + global CSS side-effect | — |

Import from the barrel:

```ts
import { Colors, Spacing, Radius, BorderWidth } from '@/theme';
// padding: Spacing[16]   borderRadius: Radius.large   borderWidth: BorderWidth.default
```

## Syncing with Figma

1. In Figma (Notely file), export the **Primitives** and **Tokens** variable
   collections as DTCG JSON.
2. Replace `figma/primitives.tokens.json` and `figma/tokens.tokens.json`.
3. Reflect any value/name changes in the matching `.ts` file. Keep the `.ts`
   values equal to the JSON — the JSON is the traceable source, the `.ts` is what
   the app imports.

## Known gaps (confirm with design)

- **No semantic color tokens in Figma yet** — only primitives (Base + Grey). The
  `Colors` role→grey mapping in `colors.ts` is a code-side decision; alias it to
  real Figma color tokens once they exist.
- **No accent/brand color** in the export. The link-blue `#3c87f7` in
  `themed-text`/`listening-indicator` is a placeholder, not a token.
- **No typography tokens** in the export; the type scale still lives in
  `components/themed-text.tsx`.

## What does NOT go here

- React components (`src/components/`), logic, data shapes (`src/types/`),
  utilities (`src/lib/`).
- Consuming **primitives** directly in components — go through the semantic
  tokens, mirroring how Figma aliases Primitives → Tokens.

## Contract

The semantic token objects and `ThemeColor` are stable public shapes every
component depends on. Changing a token **name** is a breaking change — treat it
like a `src/types/` change and announce it.

> `@/constants/theme` is a deprecated alias that re-exports this folder; new code
> imports from `@/theme`.
