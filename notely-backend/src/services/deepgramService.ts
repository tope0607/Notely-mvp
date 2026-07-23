import axios, { AxiosError } from "axios";
import fs from "fs";
import path from "path";
import { DeepgramResponse } from "../types/transcript";
import { TranscriptionService } from "./interfaces/TranscriptionService";
import { AppError } from "../utils/AppError";

const DEEPGRAM_BASE_URL = "https://api.deepgram.com/v1/listen";

const CONTENT_TYPES: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
};

function contentTypeFor(filePath: string): string {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "audio/mpeg";
}

const QUERY_PARAMS = {
  punctuate: true,
  utterances: true,
  smart_format: true,
};

function toAppError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const body = JSON.stringify(axiosError.response?.data);
    return new AppError(
      `Deepgram transcription request failed${status ? ` (status ${status})` : ""}: ${body ?? axiosError.message}`,
      502
    );
  }
  return error instanceof Error ? new AppError(error.message, 500) : new AppError(String(error), 500);
}

export class DeepgramService implements TranscriptionService {
  constructor(private readonly apiKey: string) {}

  /**
   * Preferred path: hands Deepgram the source URL and lets them fetch the
   * audio themselves, avoiding a download+upload round trip through us.
   */
  async transcribeUrl(audioUrl: string): Promise<DeepgramResponse> {
    try {
      const response = await axios.post<DeepgramResponse>(
        DEEPGRAM_BASE_URL,
        { url: audioUrl },
        {
          headers: {
            Authorization: `Token ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          params: QUERY_PARAMS,
        }
      );

      return response.data;
    } catch (error) {
      throw toAppError(error);
    }
  }

  /**
   * Fallback path: uploads a local file we've already downloaded. Used when
   * Deepgram can't fetch the source URL itself.
   */
  async transcribe(audioFilePath: string): Promise<DeepgramResponse> {
    const audio = fs.readFileSync(audioFilePath);

    try {
      const response = await axios.post<DeepgramResponse>(DEEPGRAM_BASE_URL, audio, {
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": contentTypeFor(audioFilePath),
        },
        params: QUERY_PARAMS,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      return response.data;
    } catch (error) {
      throw toAppError(error);
    }
  }
}
