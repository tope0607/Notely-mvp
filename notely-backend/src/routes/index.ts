import { Router } from "express";
import { episodesRouter } from "./episodes";
import { healthRouter } from "./health";
import { spotifyRouter } from "./spotify";

export const router = Router();

router.use("/health", healthRouter);
router.use("/api/episodes", episodesRouter);
router.use("/api/spotify", spotifyRouter);
