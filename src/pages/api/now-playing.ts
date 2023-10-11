import type { APIRoute } from 'astro';

import { optimizeImage } from '@/shared/lib/image';
import { spotifyAPI } from '@/shared/lib/spotify';

const IMAGE_SIZE = 80;

export const GET: APIRoute = async ({ locals }) => {
  const nowPlayingData = await spotifyAPI.getNowPlaying();

  if (nowPlayingData) {
    if (nowPlayingData.image?.url) {
      const optimizedImage = await optimizeImage({
        height: IMAGE_SIZE,
        isSupportAvif: locals.userAgent.isSupportAvif,
        src: nowPlayingData.image.url,
        width: IMAGE_SIZE,
      });

      nowPlayingData.image = {
        height: optimizedImage.options.height || IMAGE_SIZE,
        url: optimizedImage.src,
        width: optimizedImage.options.width || IMAGE_SIZE,
      };
    }

    return new Response(JSON.stringify(nowPlayingData), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  }

  return new Response(null, { status: 404 });
};
