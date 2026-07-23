import { ListenNotesEpisode, ListenNotesSearchResult } from "../../types/episode";

export interface PodcastMetadataService {
  search(query: string): Promise<ListenNotesSearchResult>;
  getEpisode(episodeId: string): Promise<ListenNotesEpisode>;
}
