# `src/storage/` — Local note storage (model + CRUD)

**Track / owner:** Track 2 — Backend / Data
**Linear:** [TOP-14](https://linear.app/) (parent), **TOP-20** (local storage model + CRUD)

The on-device home for saved notes. MVP is **local-only, no backend**. This is
the single module allowed to touch the storage engine — everything else goes
through `createNote` / `listNotes` / `getNote` / `updateNote` / `deleteNote`.

## What lives here

- `notes-repository.ts` — CRUD over `Note`. (TOP-20)
- `index.ts` — barrel.

## What does NOT go here

- The `Note` shape itself → `src/types/` (shared contract).
- Fetching data to *build* a note (Spotify/RSS) → `src/services/`.
- Cloud sync — **deferred** for the MVP. Don't add a sync layer or remote
  adapter yet; keeping all engine access behind this repository is what leaves
  the door open to add one later without touching callers.

## Contract

Reads/writes **`Note` / `NewNote`** (`@/types`). Track 1's home (notes library)
and note-detail screens depend on these function signatures.

## Deps

Recommended (not installed): `expo-sqlite` (query-able) or
`@react-native-async-storage/async-storage` (simplest). Pick one, list it here.
