import { DownloadResult } from "../../types/episode";

export interface AudioDownloader {
  download(audioUrl: string, destinationDir: string, baseFileName: string): Promise<DownloadResult>;
}
