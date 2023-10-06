import { getPortfolioFeedsAndTotal } from '@/shared/lib/portfolio';
import type { GetServerData } from '@/shared/types/general';

import type { HomeData } from './types';

export const getServerDataForHome: GetServerData<HomeData> = () => {
  return {
    hasRecentlyPlayedTracks: false,
    hasTopTracks: false,
    portfolio: getPortfolioFeedsAndTotal(),
    selectedTab: 'grid',
    spotifyNowPlaying: null,
    totalTechSkills: 0,
  };
};
