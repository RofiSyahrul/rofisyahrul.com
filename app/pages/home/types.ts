import type { SpotifyNowPlayingData } from '~/lib/spotify/types';
import type { FetchPortfolioFeedsResult } from '~/repositories/portfolio/types';
import type { ProfileContent } from '~/repositories/profile/types';

export interface HomeData {
  profile: ProfileContent;
  portfolio: FetchPortfolioFeedsResult;
  spotifyNowPlaying: SpotifyNowPlayingData | null;
  totalTechSkills: number;
}
