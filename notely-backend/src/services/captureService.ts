import { config } from "../config";
import { ListenNotesService } from "./listenNotesService";
import { getOrCreateTranscript } from "./transcriptService";
import { extractSegment, TranscriptSegment } from "./segmentExtractor";

const listenNotesService = new ListenNotesService(config.listenNotesApiKey);

export interface CaptureResult {
  podcastName: string | null;
  episodeTitle: string;
  timestamp: number;
  transcriptSegment: TranscriptSegment;
}

export async function buildCapture(episodeId: string, timestampSeconds: number): Promise<CaptureResult> {
  const episode = await listenNotesService.getEpisode(episodeId);
  const transcript = await getOrCreateTranscript(episodeId);
  const segment = extractSegment(transcript, timestampSeconds);

  return {
    podcastName: episode.podcast?.title ?? null,
    episodeTitle: episode.title,
    timestamp: timestampSeconds,
    transcriptSegment: segment,
  };
}
