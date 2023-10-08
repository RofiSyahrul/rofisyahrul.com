import type { PortfolioFeedsAndTotal } from '@/shared/lib/portfolio/types';
import type { SpotifyNowPlayingData } from '@/shared/types/spotify';

export interface HomeData {
  hasRecentlyPlayedTracks: boolean;
  hasTopTracks: boolean;
  portfolio: PortfolioFeedsAndTotal;
  selectedTab: 'grid' | 'list';
  spotifyNowPlaying: SpotifyNowPlayingData | null;
  totalTechSkills: number;
}
