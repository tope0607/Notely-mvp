import axios, { AxiosError } from "axios";
import { refreshAccessToken } from "./spotifyAuthService";
import { spotifyTokenStore } from "./spotifyTokenStore";
import { SpotifyNowPlaying, SpotifyTokens } from "../types/spotify";
import { AppError } from "../utils/AppError";

const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const EXPIRY_BUFFER_MS = 60_000;

interface SpotifyNowPlayingResponse {
  is_playing: boolean;
  progress_ms: number | null;
  currently_playing_type: string;
  item: {
    name: string;
    show?: { name: string };
  } | null;
}

async function getValidAccessToken(): Promise<string> {
  const tokens = spotifyTokenStore.get();
  if (!tokens) {
    throw new AppError("Not connected to Spotify. Visit /api/spotify/login first.", 401);
  }

  if (Date.now() < tokens.expiresAt - EXPIRY_BUFFER_MS) {
    return tokens.accessToken;
  }

  const refreshed: SpotifyTokens = await refreshAccessToken(tokens.refreshToken);
  spotifyTokenStore.set(refreshed);
  return refreshed.accessToken;
}

export async function getNowPlaying(): Promise<SpotifyNowPlaying> {
  const accessToken = await getValidAccessToken();

  let response;
  try {
    response = await axios.get<SpotifyNowPlayingResponse>(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { additional_types: "episode" },
      validateStatus: (status) => status === 200 || status === 204,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const body = JSON.stringify(axiosError.response?.data);
      throw new AppError(
        `Spotify now-playing request failed${status ? ` (status ${status})` : ""}: ${body ?? axiosError.message}`,
        502
      );
    }
    throw error instanceof Error ? new AppError(error.message, 500) : new AppError(String(error), 500);
  }

  if (response.status === 204 || !response.data) {
    throw new AppError("Nothing is currently playing on Spotify.", 404);
  }

  if (response.data.currently_playing_type !== "episode") {
    throw new AppError("Currently playing item is not a podcast episode.", 409);
  }

  if (!response.data.item) {
    // Without additional_types=episode, Spotify omits "item" entirely for
    // episodes even though is_playing/progress_ms/currently_playing_type are
    // populated. The query param above fixes that -- this is a defensive
    // fallback in case Spotify ever omits it for some other reason.
    throw new AppError(
      `Spotify confirmed a podcast episode is playing (position ~${Math.round(
        (response.data.progress_ms ?? 0) / 1000
      )}s) but did not include episode/show details in its response.`,
      502
    );
  }

  return {
    showName: response.data.item.show?.name ?? "",
    episodeName: response.data.item.name,
    progressSeconds: (response.data.progress_ms ?? 0) / 1000,
    isPlaying: response.data.is_playing,
  };
}
