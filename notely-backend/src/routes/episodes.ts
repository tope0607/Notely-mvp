import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  capture,
  downloadEpisodeAudio,
  getEpisode,
  getSegment,
  getTranscript,
  search,
} from "../controllers/episodesController";

export const episodesRouter = Router();

episodesRouter.get("/search", asyncHandler(search));
episodesRouter.get("/:id", asyncHandler(getEpisode));
episodesRouter.post("/:id/audio", asyncHandler(downloadEpisodeAudio));
episodesRouter.post("/:id/transcript", asyncHandler(getTranscript));
episodesRouter.get("/:id/segment", asyncHandler(getSegment));
episodesRouter.post("/:id/capture", asyncHandler(capture));
