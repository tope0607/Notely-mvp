export interface TranscriptWord {
  word: string;
  punctuated_word?: string;
  start: number;
  end: number;
}

export interface TranscriptUtterance {
  text: string;
  start: number;
  end: number;
}

export interface Transcript {
  episodeId: string;
  fullText: string;
  words: TranscriptWord[];
  utterances: TranscriptUtterance[];
}

interface DeepgramAlternative {
  transcript: string;
  words?: TranscriptWord[];
}

interface DeepgramUtterance {
  transcript: string;
  start: number;
  end: number;
}

export interface DeepgramResponse {
  results: {
    channels: Array<{
      alternatives: DeepgramAlternative[];
    }>;
    utterances?: DeepgramUtterance[];
  };
  // Catch-all so we can still inspect any other top-level metadata Deepgram returns.
  [key: string]: unknown;
}
