import { optimizeImage } from '@/shared/lib/image';
import { getPortfolioFeedsAndTotal } from '@/shared/lib/portfolio';
import { spotifyAPI } from '@/shared/lib/spotify';
import type { GetServerData } from '@/shared/types/general';

import type { HomeData } from './types';

const SPOTIFY_IMAGE_SIZE = 80;

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
    const optimizedImage = await optimizeImage({
      height: SPOTIFY_IMAGE_SIZE,
      isSupportAvif: locals.userAgent.isSupportAvif,
      src: spotifyNowPlaying.image.url,
      width: SPOTIFY_IMAGE_SIZE,
    });

    spotifyNowPlaying.image = {
      height: optimizedImage.options.height || SPOTIFY_IMAGE_SIZE,
      url: optimizedImage.src,
      width: optimizedImage.options.width || SPOTIFY_IMAGE_SIZE,
    };
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
