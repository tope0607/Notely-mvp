# `src/services/transcripts/` — RSS discovery, parsing, cache

**Track / owner:** Track 2 — Backend / Data
**Linear:** [TOP-14](https://linear.app/) (parent), **TOP-17** (RSS discovery + supported-shows table), **TOP-18** (JSON+VTT parser), **TOP-19** (cache)

Turns a supported show + episode into a parsed `Transcript`. Spotify tells us
*what/when*; this folder provides the actual words.

## What lives here

- `supported-shows.ts` — hardcoded allow-list (Lex Fridman, Huberman Lab, All-In,
  Tim Ferriss, The Daily) + `findSupportedShow()`. (TOP-17)
- `rss.ts` — fetch/parse a feed, list episodes + transcript URLs. (TOP-17)
- `parser.ts` — JSON and VTT → `Transcript`. (TOP-18)
- `cache.ts` — on-device transcript cache. (TOP-19)
- `index.ts` — barrel.

## What does NOT go here

- Spotify playback → `../spotify/`.
- Episode matching (which RSS episode == the Spotify episode) → `src/capture/`
  (Track 3). This folder only *lists* episodes; Track 3 decides which one.
- Segment extraction → `src/capture/` (Track 3).

## Contract

Produces **`Transcript` / `TranscriptCue`** (`@/types`) and `RssEpisode`
(local). `Transcript` is the seam with Track 3's segment extractor.

## Deps

Recommended (not installed): an XML parser for RSS, `expo-file-system` for the
cache. List them here before installing.
