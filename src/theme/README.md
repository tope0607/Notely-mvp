# `src/theme/` — Design tokens

**Track / owner:** Track 1 — Design + Frontend
**Linear:** [TOP-5](https://linear.app/) (parent), **TOP-6** (design-system foundation)

The code source of truth for Notely's visual language, mirroring Figma. Every
screen and component reads spacing, color, type, and radius from here — no inline
hex or magic numbers in feature code.

## What lives here

| File            | Token            |
| --------------- | ---------------- |
| `colors.ts`     | `Colors` (light/dark), `ThemeColor` |
| `typography.ts` | `Fonts` (font-family roles) |
| `spacing.ts`    | `Spacing` scale  |
| `radii.ts`      | `Radii` corner radii |
| `layout.ts`     | `BottomTabInset`, `MaxContentWidth` |
| `index.ts`      | barrel re-export + global CSS side-effect |

Import from the barrel:

```ts
import { Colors, Spacing, Radii, Fonts } from '@/theme';
```

## What does NOT go here

- React components (those live in `src/components/`).
- App/business logic, data shapes (`src/types/`), or utilities (`src/lib/`).
- One-off style values that aren't part of the design system — if it's reused,
  make it a token; if it's truly local, keep it in the component's `StyleSheet`.

## Contract with other tracks

`ThemeColor` and the token objects are consumed by Track 1 components only, but
they are stable public shapes. Changing a token **name** (not value) is a
breaking change for every component — treat renames like a `src/types/` change
and announce them.

> Migration note: `@/constants/theme` is a deprecated alias that re-exports this
> folder. New code should import from `@/theme`.
