# `src/components/` — Reusable UI components

**Track / owner:** Track 1 — Design + Frontend
**Linear:** [TOP-5](https://linear.app/) (parent), **TOP-6** (component foundation), **TOP-13** (loading/error/empty states)

Presentational, reusable building blocks. Components read from `@/theme` and
compose the themed primitives — no business logic, no data fetching.

## What lives here

**MVP components (TOP-6):**
- `button.tsx` — `Button`
- `list-row.tsx` — `ListRow`
- `input.tsx` — `Input`
- `card.tsx` — `Card`
- `listening-indicator.tsx` — `ListeningIndicator` (active-capture, TOP-10)

**Shared states (TOP-13):** `states/` → `LoadingState`, `ErrorState`, `EmptyState`.

**Primitives / starter (kept):** `themed-text`, `themed-view`, `external-link`,
`ui/collapsible`, `animated-icon`, `hint-row`, `web-badge`, `app-tabs`. The
`hint-row` / `web-badge` / `animated-icon` pieces came from the Expo starter and
can be retired as real screens land.

## What does NOT go here

- Screens/routes → `app/` (a component is reused; a screen is a route).
- Data fetching, Spotify/RSS/storage calls → `src/services` / `src/storage`.
- Capture logic → `src/capture`.
- Design tokens → `src/theme`.

## Conventions

- Import tokens from `@/theme`, never inline hex or magic numbers.
- Render text via `<ThemedText/>` and surfaces via `<ThemedView/>` so light/dark
  and the type scale stay consistent.
- Keep components controlled and side-effect-free where possible.
