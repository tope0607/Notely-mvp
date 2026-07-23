import { Request, Response } from "express";
import { config } from "../config";
import { findAudioUrl, ListenNotesService } from "../services/listenNotesService";
import { StreamAudioDownloader } from "../services/audioDownloader";
import { getOrCreateTranscript } from "../services/transcriptService";
import { buildCapture } from "../services/captureService";
import { extractSegment } from "../services/segmentExtractor";
import { AppError } from "../utils/AppError";

const listenNotesService = new ListenNotesService(config.listenNotesApiKey);
const audioDownloader = new StreamAudioDownloader();

export async function search(req: Request, res: Response): Promise<void> {
  const query = req.query.q;
  if (typeof query !== "string" || query.trim().length === 0) {
    throw new AppError('Query parameter "q" is required.', 400);
  }

  const result = await listenNotesService.search(query);
  res.json(result);
}

export async function getEpisode(req: Request, res: Response): Promise<void> {
  const episode = await listenNotesService.getEpisode(req.params.id);
  res.json({ ...episode, resolvedAudioUrl: findAudioUrl(episode) });
}

export async function downloadEpisodeAudio(req: Request, res: Response): Promise<void> {
  const episode = await listenNotesService.getEpisode(req.params.id);
  const audioUrl = findAudioUrl(episode);

  if (!audioUrl) {
    throw new AppError(`No downloadable audio URL found for episode "${req.params.id}".`, 404);
  }

  const result = await audioDownloader.download(audioUrl, config.storageDir, episode.id);
  res.json(result);
}

export async function getTranscript(req: Request, res: Response): Promise<void> {
  const transcript = await getOrCreateTranscript(req.params.id);
  res.json(transcript);
}

function parseTimestampParam(req: Request): number {
  const timestamp = Number(req.query.timestamp);
  if (typeof req.query.timestamp !== "string" || Number.isNaN(timestamp)) {
    throw new AppError('Query parameter "timestamp" is required and must be a number.', 400);
  }
  return timestamp;
}

export async function getSegment(req: Request, res: Response): Promise<void> {
  const timestamp = parseTimestampParam(req);
  const transcript = await getOrCreateTranscript(req.params.id);
  const segment = extractSegment(transcript, timestamp);
  res.json({ episodeId: req.params.id, timestamp, ...segment });
}

export async function capture(req: Request, res: Response): Promise<void> {
  const timestamp = parseTimestampParam(req);
  res.json(await buildCapture(req.params.id, timestamp));
}
