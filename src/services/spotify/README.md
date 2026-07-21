# `src/services/spotify/` — Spotify OAuth + "what's playing"

**Track / owner:** Track 2 — Backend / Data
**Linear:** [TOP-14](https://linear.app/) (parent), **TOP-15** (OAuth), **TOP-16** ("what's playing")

Talks to Spotify to answer one question: *what podcast episode is playing right
now, and at what timestamp?* Spotify is used **only** for playback identity — the
transcript itself comes from RSS (`../transcripts/`).

## What lives here

- `auth.ts` — OAuth (PKCE) connect/refresh/disconnect. (TOP-15)
- `now-playing.ts` — normalized `getNowPlaying(): PlaybackState | null`. (TOP-16)
- `index.ts` — barrel.

## What does NOT go here

- RSS / transcript logic → `../transcripts/`.
- Episode matching (Spotify ↔ RSS) → `src/capture/` (Track 3).
- Note persistence → `src/storage/`.

## Contract

Produces **`PlaybackState`** (`@/types`). This is the seam with Track 3's episode
matcher — do not change the shape here; change it in `src/types/` by agreement.

## Env / deps

- Env: `SPOTIFY_CLIENT_ID`, `SPOTIFY_REDIRECT_URI` (see `.env.example`).
- Recommended deps (not installed): `expo-auth-session`, `expo-web-browser`,
  `expo-secure-store`.
