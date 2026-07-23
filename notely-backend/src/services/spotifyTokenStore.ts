import { SpotifyTokens } from "../types/spotify";
import { SpotifyTokenStore as SpotifyTokenStoreInterface } from "./interfaces/SpotifyTokenStore";

export class InMemorySpotifyTokenStore implements SpotifyTokenStoreInterface {
  private tokens: SpotifyTokens | null = null;
  private pendingState: string | null = null;

  get(): SpotifyTokens | null {
    return this.tokens;
  }

  set(tokens: SpotifyTokens): void {
    this.tokens = tokens;
  }

  clear(): void {
    this.tokens = null;
  }

  setPendingState(state: string): void {
    this.pendingState = state;
  }

  consumePendingState(state: string): boolean {
    const matches = this.pendingState !== null && this.pendingState === state;
    this.pendingState = null;
    return matches;
  }
}

// Single shared instance — matches the "one global Spotify connection" design;
// there's no user-accounts system yet for this to be keyed against.
export const spotifyTokenStore = new InMemorySpotifyTokenStore();
