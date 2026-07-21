# Notely — Architecture

Notely's whole job is one pipeline: **listening → “note this” → the correct
transcript segment → saved & viewable.** This doc traces that pipeline end to
end, names the folder/track that owns each step, and flags where the seams (and
the silent failures) are.

## The capture pipeline

```
[voice trigger] ─T3─▶ [timestamp + episode] ─T2─▶ [match RSS episode] ─T3─▶
   [fetch + parse transcript] ─T2─▶ [extract segment] ─T3─▶ [save + display] ─T1
```

| # | Step | Track | Folder / entry point | Produces |
| - | ---- | ----- | -------------------- | -------- |
| 1 | Continuous listening + detect **“note this”** | T3 | `src/capture/speech-recognition.ts`, `trigger-detection.ts` | `TriggerEvent` (wall-clock time) |
| 2 | Read **what's playing + timestamp** from Spotify | T2 | `src/services/spotify/now-playing.ts` | `PlaybackState` |
| 3 | **Match** the Spotify episode to an RSS episode | T3 | `src/capture/episode-matching.ts` (uses `src/services/transcripts/rss.ts`) | `EpisodeMatch` \| `null` |
| 4 | **Fetch + parse** the transcript (JSON/VTT), cached | T2 | `src/services/transcripts/rss.ts`, `parser.ts`, `cache.ts` | `Transcript` |
| 5 | **Extract** the ~30s segment (backward window, reaction-delay offset, sentence snapping) | T3 | `src/capture/segment-extraction.ts` | `TranscriptSegment` |
| 6 | **Save + display** the note | T1 / T2 | `src/storage/notes-repository.ts` → `src/app/(tabs)/index.tsx`, `note/[id].tsx` | `Note` |

The screen where this happens at runtime is **active capture**
(`src/app/capture.tsx`). Wiring these calls together is **TOP-26** (integration),
blocked by the pieces above.

## The seams (shared contracts)

The tracks only meet through the shapes in [`src/types/`](../src/types/):

- **`PlaybackState`** — T2 produces (step 2) → T3 consumes (step 3).
- **`Transcript` / `TranscriptCue`** — T2 produces (step 4) → T3 consumes (step 5).
- **`TranscriptSegment`** — T3 produces (step 5) → T1/T2 consume (step 6).
- **`Note`** — T3 assembles → T2 persists → T1 renders (step 6).

These are the mismatch points: if two tracks disagree on units or fields, the
pipeline breaks quietly. Units are fixed by contract — `*Sec` fields are
**seconds from episode start**; `*At` fields are **epoch ms**. Change a shape
only by agreement (see `CONTRIBUTING.md`).

## Two silent-failure risks

Most bugs here throw or show an error. **Two steps fail silently — they return a
plausible-but-wrong result** and the user only notices the note is off:

1. **Episode matching (step 3, `episode-matching.ts`).** Spotify and RSS share no
   ids, so matching is heuristic (title similarity, publish date, duration). A
   wrong match fetches the wrong transcript and *every* downstream note is bogus.
   Mitigation: prefer returning `null` (no confident match) over guessing;
   threshold on confidence; test against real feeds.

2. **Segment extraction (step 5, `segment-extraction.ts`).** The reaction-delay
   offset and sentence-boundary snapping decide which words get captured. Wrong
   offsets still return *a* segment — just the wrong 30 seconds. Mitigation: tune
   `DEFAULT_EXTRACTION_OPTIONS` against real transcripts and cover with unit
   tests.

Both deserve tests and real-data validation before the integration (TOP-26) is
considered done.
