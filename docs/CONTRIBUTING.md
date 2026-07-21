# Contributing to Notely

Three people work on Notely in parallel. These conventions keep us out of each
other's way and keep the shared contracts stable.

## Tracks & where code goes

| Track | You own | Put new code in |
| ----- | ------- | --------------- |
| **1 — Design + Frontend** | design system, screens, components, states | `src/app/`, `src/theme/`, `src/components/` |
| **2 — Backend / Data** | Spotify, RSS/transcripts, storage | `src/services/`, `src/storage/` |
| **3 — AI / Algorithm** | speech/trigger, extraction, matching | `src/capture/` |
| **Shared** | cross-track types | `src/types/` (by agreement) |

Each folder's `README.md` says exactly what does and doesn't belong there. When
in doubt, check it before adding a file.

## Shared types change by agreement

`src/types/` is the contract between all three tracks. A change there can
silently break another track, so:

- **Additive, optional** fields: fine, just mention it.
- **Rename / remove / change meaning or units**: get a 👍 from the other affected
  owners first (a quick message or PR review), and update all consumers in the
  same PR.

Never redefine another track's shape locally to "unblock" yourself — import from
`@/types` and raise the mismatch.

## Picking up a Linear issue

1. Grab an issue from your track's parent (**TOP-5** / **TOP-14** / **TOP-21**;
   integration is **TOP-26**).
2. Move it to *In Progress* and assign yourself.
3. Branch, build, open a PR that references the issue (`TOP-xx`).

## Branch naming

```
<track>/TOP-<id>-<short-slug>
```

Track prefix is one of `fe`, `data`, `ai` (or `integration`). Examples:

```
fe/TOP-9-notes-library
data/TOP-18-vtt-parser
ai/TOP-24-segment-extraction
```

## Commits

- Present-tense, imperative summary; reference the issue.
  `TOP-18: parse VTT transcripts into Transcript cues`
- Keep commits focused; don't bundle unrelated changes across tracks.

## Code conventions

- **TypeScript everywhere**; no implicit `any` (strict mode is on).
- Import shared shapes from `@/types`, tokens from `@/theme`, utils from `@/lib`.
- Use the `@/` path alias, not long relative paths.
- Placeholder/unimplemented work: leave a `TODO(TOP-xx)` where the real code goes.
- UI: render text via `<ThemedText/>`, surfaces via `<ThemedView/>`, and pull
  spacing/color/radius from `@/theme` — no inline hex or magic numbers.

## Running the app

See the root `README.md` — install the custom dev build once, then
`npx expo start --dev-client`. Rebuild the dev build only when native deps change.

## Scope discipline

Keep the codebase focused on the MVP (see root `README.md`). Deferred features
(background listening, Quick Settings tile, YouTube, audio fallback, cloud sync)
don't get folders or abstractions yet.
