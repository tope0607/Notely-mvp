import { DeepgramResponse } from "../../types/transcript";

export interface TranscriptionService {
  transcribe(audioFilePath: string): Promise<DeepgramResponse>;
  transcribeUrl(audioUrl: string): Promise<DeepgramResponse>;
}
