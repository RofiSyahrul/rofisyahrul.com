import type { PortfolioFeedsAndTotal } from '@/shared/lib/portfolio/types';

export interface HomeData {
  hasRecentlyPlayedTracks: boolean;
  hasTopTracks: boolean;
  portfolio: PortfolioFeedsAndTotal;
  selectedTab: 'grid' | 'list';
  spotifyNowPlaying: null;
  totalTechSkills: number;
}
