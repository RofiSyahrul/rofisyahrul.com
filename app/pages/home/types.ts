import type { FetchPortfolioFeedsResult } from '~/repositories/portfolio/types';
import type { ProfileContent } from '~/repositories/profile/types';
import type { SpotifyNowPlayingData } from '~/types/spotify';

export interface HomeData {
  hasRecentlyPlayedTracks: boolean;
  hasTopTracks: boolean;
  profile: ProfileContent;
  portfolio: FetchPortfolioFeedsResult;
  spotifyNowPlaying: SpotifyNowPlayingData | null;
  totalTechSkills: number;
}
