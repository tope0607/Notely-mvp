import dotenv from "dotenv";
import path from "path";

dotenv.config();

function requireEnv(name: string, placeholder?: string): string {
  const value = process.env[name];
  if (!value || value === placeholder) {
    throw new Error(`Missing ${name}. Set it in the .env file before starting the server.`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  listenNotesApiKey: requireEnv("LISTEN_NOTES_API_KEY", "your_api_key_here"),
  deepgramApiKey: requireEnv("DEEPGRAM_API_KEY", "your_api_key_here"),
  storageDir: process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR)
    : path.resolve(process.cwd(), "storage", "audio"),
  transcriptCacheDir: process.env.TRANSCRIPT_CACHE_DIR
    ? path.resolve(process.env.TRANSCRIPT_CACHE_DIR)
    : path.resolve(process.cwd(), "storage", "transcripts"),
  spotifyClientId: requireEnv("SPOTIFY_CLIENT_ID", "your_spotify_client_id_here"),
  spotifyClientSecret: requireEnv("SPOTIFY_CLIENT_SECRET", "your_spotify_client_secret_here"),
  spotifyRedirectUri: requireEnv("SPOTIFY_REDIRECT_URI", "your_spotify_redirect_uri_here"),
};
