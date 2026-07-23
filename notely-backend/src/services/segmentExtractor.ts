import { Transcript } from "../types/transcript";
import { AppError } from "../utils/AppError";

const LOOKBACK_SECONDS = 30;

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
}

export function extractSegment(transcript: Transcript, timestampSeconds: number): TranscriptSegment {
  if (!Number.isFinite(timestampSeconds) || timestampSeconds < 0) {
    throw new AppError("Query parameter \"timestamp\" must be a non-negative number.", 400);
  }

  const windowStart = Math.max(0, timestampSeconds - LOOKBACK_SECONDS);
  const windowEnd = timestampSeconds;

  const matched = transcript.utterances.filter(
    (utterance) => utterance.end > windowStart && utterance.start <= windowEnd
  );

  if (matched.length === 0) {
    throw new AppError(
      `No transcript found near timestamp ${timestampSeconds}s for episode "${transcript.episodeId}".`,
      404
    );
  }

  return {
    text: matched.map((utterance) => utterance.text).join(" "),
    start: matched[0].start,
    end: matched[matched.length - 1].end,
  };
}
