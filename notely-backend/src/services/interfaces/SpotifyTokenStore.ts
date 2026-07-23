import { SpotifyTokens } from "../../types/spotify";

export interface SpotifyTokenStore {
  get(): SpotifyTokens | null;
  set(tokens: SpotifyTokens): void;
  clear(): void;
  setPendingState(state: string): void;
  consumePendingState(state: string): boolean;
}
