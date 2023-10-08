import type { APIRoute } from 'astro';

import { spotifyAPI } from '@/shared/lib/spotify';

export const GET: APIRoute = async () => {
  const nowPlayingData = await spotifyAPI.getNowPlaying();

  if (nowPlayingData) {
    return new Response(JSON.stringify(nowPlayingData), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  }

  return new Response(null, { status: 404 });
};
