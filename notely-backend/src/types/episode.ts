export interface ListenNotesSearchResult {
  id: string;
  title_original: string;
  podcast_title_original?: string;
}

export interface ListenNotesEpisode {
  id: string;
  title: string;
  // Listen Notes' documented field for the direct, downloadable audio file.
  audio?: string;
  // Not part of the official Listen Notes schema, but kept here defensively
  // in case the API (or a similar podcast API) exposes it under this name.
  audio_url?: string;
  // Some podcast APIs (e.g. raw RSS-derived data) expose an "enclosure"
  // object/URL instead of a flat "audio" field.
  enclosure?: {
    url?: string;
    type?: string;
  } | string;
  audio_length_sec?: number;
  podcast?: {
    title?: string;
    publisher?: string;
    [key: string]: unknown;
  };
  // Catch-all so we can still enumerate/inspect every other top-level key.
  [key: string]: unknown;
}

export interface DownloadResult {
  fileName: string;
  absolutePath: string;
  fileSizeBytes: number;
}
