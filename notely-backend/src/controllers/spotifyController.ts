import crypto from "crypto";
import { Request, Response } from "express";
import { buildAuthorizeUrl, exchangeCode } from "../services/spotifyAuthService";
import { spotifyTokenStore } from "../services/spotifyTokenStore";
import { getNowPlaying } from "../services/spotifyNowPlayingService";
import { ListenNotesService } from "../services/listenNotesService";
import { buildCapture } from "../services/captureService";
import { config } from "../config";
import { AppError } from "../utils/AppError";

const listenNotesService = new ListenNotesService(config.listenNotesApiKey);

export function login(req: Request, res: Response): void {
  const state = crypto.randomBytes(16).toString("hex");
  spotifyTokenStore.setPendingState(state);
  res.redirect(buildAuthorizeUrl(state));
}

export async function callback(req: Request, res: Response): Promise<void> {
  const { code, state } = req.query;

  if (typeof state !== "string" || !spotifyTokenStore.consumePendingState(state)) {
    throw new AppError("Invalid or expired Spotify login state.", 400);
  }

  if (typeof code !== "string") {
    throw new AppError('Missing "code" from Spotify callback.', 400);
  }

  const tokens = await exchangeCode(code);
  spotifyTokenStore.set(tokens);
  res.json({ message: "Spotify connected." });
}

export async function nowPlaying(req: Request, res: Response): Promise<void> {
  res.json(await getNowPlaying());
}

export async function captureFromSpotify(req: Request, res: Response): Promise<void> {
  const playing = await getNowPlaying();
  const matched = await listenNotesService.search(`${playing.episodeName} ${playing.showName}`);
  const result = await buildCapture(matched.id, playing.progressSeconds);

  res.json({
    ...result,
    matchedListenNotesEpisodeId: matched.id,
    matchedListenNotesEpisodeTitle: matched.title_original,
  });
}
