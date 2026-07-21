# Notely

Notely is a voice-activated podcast note-capture app. While you listen to a
podcast on Spotify **with the app open**, you say **“note this”** and Notely
grabs the relevant ~30-second transcript segment as a note — saved locally and
tagged with the podcast name, episode, and timestamp.

**Core loop:** listening → “note this” → correct transcript segment captured →
saved & viewable.

## MVP scope

**In scope**

- **Foreground-first**: the app is open while you listen.
- **Spotify** detects *what's playing + timestamp* only.
- **Transcripts** come from each show's **RSS feed** (JSON and VTT first), for a
  small hardcoded list of supported shows (Lex Fridman, Huberman Lab, All-In,
  Tim Ferriss, The Daily).
- **Local, on-device storage** — no backend server.
- **Android-first.**

**Explicitly deferred** (do not build folders/abstractions for these yet, but
don't make them impossible later): background listening, a Quick Settings tile,
YouTube support, an audio-capture fallback, and cloud sync.

## Prerequisites

- Node LTS + npm
- A **custom dev build** of Notely installed on an Android device/emulator
  (this project uses a development build with native modules — **not** Expo Go).
- Android device or emulator

## Run the dev build

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install the **custom dev build** (the Notely app with native modules) on your
   device/emulator once — see the Expo [development builds](https://docs.expo.dev/develop/development-builds/introduction/)
   docs.
3. Start the bundler and open it in the dev build:
   ```bash
   npx expo start --dev-client
   ```

> You only need to **rebuild** the dev build when **native dependencies change**
> (a new native module, or config-plugin/`app.json` native changes). Day-to-day
> JS/TS edits just need `npx expo start --dev-client`.

## Folder map

Expo Router's route files live in `src/app/`; everything else lives under `src/`,
grouped by owner.

| Path                       | What                                                        |
| -------------------------- | ---------------------------------------------------------- |
| `src/app/`                 | Routes/screens only (Expo Router).                         |
| `src/theme/`               | Design tokens (colors, type, spacing, radii) — Figma → code. |
| `src/components/`          | Reusable UI + shared loading/error/empty states.           |
| `src/services/spotify/`    | Spotify OAuth + "what's playing".                          |
| `src/services/transcripts/`| RSS discovery, JSON/VTT parser, cache, supported shows.    |
| `src/storage/`             | Note data model + local CRUD.                              |
| `src/capture/`             | Speech recognition, "note this" trigger, segment extraction, episode matching. |
| `src/types/`               | Shared TypeScript contracts (change by agreement).         |
| `src/lib/`                 | Small shared utilities.                                    |
| `docs/`                    | `ARCHITECTURE.md`, `CONTRIBUTING.md`.                      |

Each `src/*` folder has its own `README.md` stating owner, what does/doesn't
belong, and the related Linear issues.

## Three-track ownership

| Track | Area | Folders | Linear |
| ----- | ---- | ------- | ------ |
| **1 — Design + Frontend** | Design system, all screens, reusable components, loading/error/empty states | `src/app/`, `src/theme/`, `src/components/` | **TOP-5** (TOP-6…TOP-13) |
| **2 — Backend / Data** | Spotify OAuth + now-playing, RSS discovery/parse/cache, local storage | `src/services/`, `src/storage/` | **TOP-14** (TOP-15…TOP-20) |
| **3 — AI / Algorithm** | Speech + trigger, segment extraction, episode matching | `src/capture/` | **TOP-21** (TOP-22…TOP-25) |
| **Shared** | Cross-track types/contracts | `src/types/` | consensus |
| **Integration** | Wire the tracks into one capture flow | — | **TOP-26** |

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the end-to-end capture
pipeline and where the tracks meet, and
[`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for team conventions.

## Design source

Track 1's visual language comes from the **Notely** Figma file. Its variable
collections (**Primitives** and **Tokens**) are mirrored in code under
[`src/theme/`](src/theme/) — the raw DTCG exports live in `src/theme/figma/`,
and `src/theme/README.md` documents how to re-sync when Figma changes.

## Path alias

Imports use the `@/` alias → `src/` (configured in `tsconfig.json`), plus
`@/assets/*` → `assets/*`. Example: `import { Colors } from '@/theme';`.

## Config / secrets

Copy `.env.example` → `.env` and fill in the Spotify credentials. The real
`.env` is gitignored.

## Linear

Project board: <https://linear.app/> — Tracks **TOP-5** (Design/FE),
**TOP-14** (Backend/Data), **TOP-21** (AI/Algorithm), integration **TOP-26**.
