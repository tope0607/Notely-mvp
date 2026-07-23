import fs from "fs";
import path from "path";
import { Transcript } from "../types/transcript";
import { TranscriptCache as TranscriptCacheInterface } from "./interfaces/TranscriptCache";

export class FileTranscriptCache implements TranscriptCacheInterface {
  constructor(private readonly cacheDir: string) {}

  async get(episodeId: string): Promise<Transcript | null> {
    const filePath = this.pathFor(episodeId);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Transcript;
  }

  async set(episodeId: string, transcript: Transcript): Promise<void> {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
    fs.writeFileSync(this.pathFor(episodeId), JSON.stringify(transcript, null, 2));
  }

  private pathFor(episodeId: string): string {
    return path.resolve(this.cacheDir, `${episodeId}.json`);
  }
}
