import axios, { AxiosError } from "axios";
import { ListenNotesEpisode, ListenNotesSearchResult } from "../types/episode";
import { PodcastMetadataService } from "./interfaces/PodcastMetadataService";
import { AppError } from "../utils/AppError";

const LISTEN_NOTES_BASE_URL = "https://listen-api.listennotes.com/api/v2";

interface SearchResponse {
  results: ListenNotesSearchResult[];
}

function toAppError(error: unknown, action: string): AppError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const body = JSON.stringify(axiosError.response?.data);
    return new AppError(
      `${action} failed${status ? ` (status ${status})` : ""}: ${body ?? axiosError.message}`,
      502
    );
  }
  return error instanceof Error ? new AppError(error.message, 500) : new AppError(String(error), 500);
}

/**
 * Locates a downloadable audio URL somewhere in an episode response.
 * Listen Notes' documented field is "audio", but we also check a couple of
 * alternate/legacy field names defensively, in case the response shape
 * differs from what's documented.
 */
export function findAudioUrl(episode: ListenNotesEpisode): string | null {
  if (typeof episode.audio === "string" && episode.audio.length > 0) {
    return episode.audio;
  }

  if (typeof episode.audio_url === "string" && episode.audio_url.length > 0) {
    return episode.audio_url;
  }

  if (typeof episode.enclosure === "string" && episode.enclosure.length > 0) {
    return episode.enclosure;
  }

  if (
    episode.enclosure &&
    typeof episode.enclosure === "object" &&
    typeof episode.enclosure.url === "string"
  ) {
    return episode.enclosure.url;
  }

  return null;
}

export class ListenNotesService implements PodcastMetadataService {
  constructor(private readonly apiKey: string) {}

  async search(query: string): Promise<ListenNotesSearchResult> {
    try {
      const response = await axios.get<SearchResponse>(`${LISTEN_NOTES_BASE_URL}/search`, {
        headers: { "X-ListenAPI-Key": this.apiKey },
        params: { q: query, type: "episode", len_min: 1 },
      });

      const [firstResult] = response.data.results;
      if (!firstResult) {
        throw new AppError(`No episode results found for query "${query}".`, 404);
      }
      return firstResult;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw toAppError(error, "Listen Notes search request");
    }
  }

  async getEpisode(episodeId: string): Promise<ListenNotesEpisode> {
    try {
      const response = await axios.get<ListenNotesEpisode>(
        `${LISTEN_NOTES_BASE_URL}/episodes/${episodeId}`,
        {
          headers: { "X-ListenAPI-Key": this.apiKey },
          params: { show_transcript: 0 },
        }
      );

      return response.data;
    } catch (error) {
      throw toAppError(error, "Listen Notes episode request");
    }
  }
}
