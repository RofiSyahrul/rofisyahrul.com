import { getPortfolioFeedsAndTotal } from '@/shared/lib/portfolio';
import { spotifyAPI } from '@/shared/lib/spotify';
import type { GetServerData } from '@/shared/types/general';

import type { HomeData } from './types';

export const getServerDataForHome: GetServerData<
  HomeData
> = async () => {
  const [hasRecentlyPlayedTracks, hasTopTracks, spotifyNowPlaying] =
    await Promise.all([
      spotifyAPI.hasRecentlyPlayedTracks(),
      spotifyAPI.hasTopTracks(),
      spotifyAPI.getNowPlaying(),
    ]);

  return {
    hasRecentlyPlayedTracks,
    hasTopTracks,
    portfolio: getPortfolioFeedsAndTotal(),
    selectedTab: 'grid',
    spotifyNowPlaying,
    totalTechSkills: 0,
  };
};
