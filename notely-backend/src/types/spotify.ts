export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SpotifyNowPlaying {
  showName: string;
  episodeName: string;
  progressSeconds: number;
  isPlaying: boolean;
}
