import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { callback, captureFromSpotify, login, nowPlaying } from "../controllers/spotifyController";

export const spotifyRouter = Router();

spotifyRouter.get("/login", login);
spotifyRouter.get("/callback", asyncHandler(callback));
spotifyRouter.get("/now-playing", asyncHandler(nowPlaying));
spotifyRouter.post("/capture", asyncHandler(captureFromSpotify));
