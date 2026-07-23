import axios from "axios";
import fs from "fs";
import path from "path";
import { URL } from "url";
import { DownloadResult } from "../types/episode";
import { AudioDownloader as AudioDownloaderInterface } from "./interfaces/AudioDownloader";

/**
 * Extracts a file extension from an audio URL, falling back to ".mp3"
 * (the most common podcast audio format) if none can be determined.
 *
 * Query strings and fragments are stripped before inspecting the path,
 * since a URL like ".../episode.mp3?token=abc" would otherwise resolve
 * to the wrong extension.
 */
export function resolveAudioExtension(audioUrl: string): string {
  const parsed = new URL(audioUrl);
  const ext = path.extname(parsed.pathname);
  return ext && ext.length <= 5 ? ext : ".mp3";
}

export class StreamAudioDownloader implements AudioDownloaderInterface {
  async download(
    audioUrl: string,
    destinationDir: string,
    baseFileName: string
  ): Promise<DownloadResult> {
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    const extension = resolveAudioExtension(audioUrl);
    const fileName = `${baseFileName}${extension}`;
    const absolutePath = path.resolve(destinationDir, fileName);

    // Request the file as a stream so we never load the whole audio file
    // into memory at once.
    const response = await axios.get(audioUrl, { responseType: "stream" });

    const writer = fs.createWriteStream(absolutePath);

    await new Promise<void>((resolve, reject) => {
      response.data.pipe(writer);
      writer.on("finish", () => resolve());
      writer.on("error", (err: Error) => reject(err));
      response.data.on("error", (err: Error) => reject(err));
    });

    const { size } = fs.statSync(absolutePath);

    return {
      fileName,
      absolutePath,
      fileSizeBytes: size,
    };
  }
}
