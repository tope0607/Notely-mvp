import axios, { AxiosError } from "axios";
import { config } from "../config";
import { SpotifyTokens } from "../types/spotify";
import { AppError } from "../utils/AppError";

const AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const SCOPE = "user-read-currently-playing";

interface SpotifyTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

function basicAuthHeader(): string {
  const credentials = Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString("base64");
  return `Basic ${credentials}`;
}

async function requestTokens(params: URLSearchParams, previousRefreshToken?: string): Promise<SpotifyTokens> {
  try {
    const response = await axios.post<SpotifyTokenResponse>(TOKEN_URL, params, {
      headers: {
        Authorization: basicAuthHeader(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token ?? previousRefreshToken ?? "",
      expiresAt: Date.now() + response.data.expires_in * 1000,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const body = JSON.stringify(axiosError.response?.data);
      throw new AppError(
        `Spotify token request failed${status ? ` (status ${status})` : ""}: ${body ?? axiosError.message}`,
        502
      );
    }
    throw error instanceof Error ? new AppError(error.message, 500) : new AppError(String(error), 500);
  }
}

export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: config.spotifyClientId,
    response_type: "code",
    redirect_uri: config.spotifyRedirectUri,
    scope: SCOPE,
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCode(code: string): Promise<SpotifyTokens> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: config.spotifyRedirectUri,
  });
  return requestTokens(params);
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  return requestTokens(params, refreshToken);
}
