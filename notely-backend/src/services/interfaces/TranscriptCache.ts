import { Transcript } from "../../types/transcript";

export interface TranscriptCache {
  get(episodeId: string): Promise<Transcript | null>;
  set(episodeId: string, transcript: Transcript): Promise<void>;
}
