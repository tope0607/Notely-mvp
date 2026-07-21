# `src/types/` — Shared contracts (owned by consensus)

**Owner:** All three tracks — **change by agreement only.**
**Linear:** referenced by TOP-14, TOP-21, TOP-26 (integration).

This folder is the **contract between tracks**. Every cross-track shape lives
here so no track redefines another's data. If you find yourself re-declaring a
`Note`, `PlaybackState`, or transcript shape inside a service or component,
import it from `@/types` instead.

## What lives here

| File            | Types | Producer → Consumer |
| --------------- | ----- | ------------------- |
| `note.ts`       | `Note`, `NewNote` | T3 produces → T2 persists → T1 renders |
| `playback.ts`   | `PlaybackState`, `SupportedShow` | T2 (Spotify) produces → T3 matches, T1 shows |
| `transcript.ts` | `Transcript`, `TranscriptCue`, `TranscriptSegment` | T2 parses → T3 extracts → T1 renders |

Import from the barrel:

```ts
import type { Note, PlaybackState, TranscriptSegment } from '@/types';
```

## Rules

- **Types only** — no runtime code, no components, no logic.
- **Change by agreement.** Because all three tracks depend on these shapes, a
  change here can silently break another track. Renaming or removing a field, or
  changing its meaning, requires a heads-up to the other owners (see
  `docs/CONTRIBUTING.md`). Additive optional fields are the safe kind of change.
- Keep field docs accurate — units especially (`timestampSec`, `positionSec`
  are **seconds**; `createdAt`, `fetchedAt` are **epoch ms**).
