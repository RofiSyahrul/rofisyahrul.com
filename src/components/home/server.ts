import { optimizeImage } from '@/shared/lib/image';
import { getPortfolioFeedsAndTotal } from '@/shared/lib/portfolio';
import { spotifyAPI } from '@/shared/lib/spotify';
import type { GetServerData } from '@/shared/types/general';

import type { HomeData } from './types';

export const getServerDataForHome: GetServerData<HomeData> = async ({
  locals,
}) => {
  const [hasRecentlyPlayedTracks, hasTopTracks, spotifyNowPlaying] =
    await Promise.all([
      spotifyAPI.hasRecentlyPlayedTracks(),
      spotifyAPI.hasTopTracks(),
      spotifyAPI.getNowPlaying(),
    ]);

  if (spotifyNowPlaying?.image?.url) {
    spotifyNowPlaying.image.url = await optimizeImage({
      height: 80,
      isSupportAvif: locals.userAgent.isSupportAvif,
      src: spotifyNowPlaying.image.url,
      width: 80,
    });
  }

  return {
    hasRecentlyPlayedTracks,
    hasTopTracks,
    portfolio: getPortfolioFeedsAndTotal(),
    selectedTab: 'grid',
    spotifyNowPlaying,
    totalTechSkills: 0,
  };
};
