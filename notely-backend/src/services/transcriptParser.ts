import { DeepgramResponse, Transcript } from "../types/transcript";
import { AppError } from "../utils/AppError";

export function parseTranscript(episodeId: string, raw: DeepgramResponse): Transcript {
  const alternative = raw.results?.channels?.[0]?.alternatives?.[0];

  if (!alternative) {
    throw new AppError(`Deepgram returned no transcript alternatives for episode "${episodeId}".`, 502);
  }

  const utterances = (raw.results.utterances ?? []).map((utterance) => ({
    text: utterance.transcript,
    start: utterance.start,
    end: utterance.end,
  }));

  return {
    episodeId,
    fullText: alternative.transcript,
    words: alternative.words ?? [],
    utterances,
  };
}
