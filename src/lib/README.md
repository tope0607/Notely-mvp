# `src/lib/` — Shared utilities

**Owner:** Shared (whoever needs one adds it) — keep it small and generic.

Small, **pure, dependency-free** helpers used across tracks. If a helper is
specific to one track's domain, it belongs in that track's folder, not here.

## What lives here

- `time.ts` — `formatTimestamp(seconds)` → `m:ss` / `h:mm:ss`.
- `text.ts` — `normalizeText(str)` for loose title/phrase comparison.
- `index.ts` — barrel.

## What does NOT go here

- Anything that imports from `src/services`, `src/storage`, `src/capture`, or
  React — that's a sign it belongs to a track, not `lib`.
- Design tokens → `src/theme/`. Shared types → `src/types/`.

## Rules

Utilities here should be trivially unit-testable and have no side effects, so any
track can use them without coupling.
