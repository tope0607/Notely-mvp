import fs from "fs";
import path from "path";
import { config } from "../config";
import { findAudioUrl, ListenNotesService } from "./listenNotesService";
import { resolveAudioExtension, StreamAudioDownloader } from "./audioDownloader";
import { DeepgramService } from "./deepgramService";
import { parseTranscript } from "./transcriptParser";
import { FileTranscriptCache } from "./transcriptCache";
import { DeepgramResponse, Transcript } from "../types/transcript";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

const listenNotesService = new ListenNotesService(config.listenNotesApiKey);
const audioDownloader = new StreamAudioDownloader();
const deepgramService = new DeepgramService(config.deepgramApiKey);
const transcriptCache = new FileTranscriptCache(config.transcriptCacheDir);

export async function ensureAudioOnDisk(episodeId: string): Promise<string> {
  const episode = await listenNotesService.getEpisode(episodeId);
  const audioUrl = findAudioUrl(episode);

  if (!audioUrl) {
    throw new AppError(`No downloadable audio URL found for episode "${episodeId}".`, 404);
  }

  const expectedPath = path.resolve(config.storageDir, `${episode.id}${resolveAudioExtension(audioUrl)}`);

  if (fs.existsSync(expectedPath)) {
    return expectedPath;
  }

  const result = await audioDownloader.download(audioUrl, config.storageDir, episode.id);
  return result.absolutePath;
}

export async function getOrCreateTranscript(episodeId: string): Promise<Transcript> {
  const cached = await transcriptCache.get(episodeId);
  if (cached) {
    return cached;
  }

  const episode = await listenNotesService.getEpisode(episodeId);
  const audioUrl = findAudioUrl(episode);

  if (!audioUrl) {
    throw new AppError(`No downloadable audio URL found for episode "${episodeId}".`, 404);
  }

  let raw: DeepgramResponse;
  try {
    // Preferred path: Deepgram fetches the audio itself, no download/upload through us.
    raw = await deepgramService.transcribeUrl(audioUrl);
  } catch (error) {
    logger.warn(
      `Deepgram could not transcribe episode "${episodeId}" directly from its URL; falling back to downloading the audio ourselves.`,
      error
    );
    const audioPath = await ensureAudioOnDisk(episodeId);
    raw = await deepgramService.transcribe(audioPath);
  }

  const transcript = parseTranscript(episodeId, raw);
  await transcriptCache.set(episodeId, transcript);
  return transcript;
}
