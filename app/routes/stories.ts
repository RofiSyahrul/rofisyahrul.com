import type { LoaderFunction } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

import { getStoriesSession } from '~/lib/cookies/stories.server';
import { spotifyAPI } from '~/lib/spotify/api.server';
import type { StoriesData } from '~/types/stories';
import { STORY_RECENT_PLAYED_PREFIX_SLUG } from '~/types/stories';
import { STORY_NOW_PLAYING_SLUG } from '~/types/stories';
import parseURL from '~/utils/parse-url.server';

export const loader: LoaderFunction = async ({ request }) => {
  const [spotifyNowPlaying, recentPlayedTracks] = await Promise.all([
    spotifyAPI.getNowPlaying(),
    spotifyAPI.getRecentlyPlayedTracks(),
  ]);

  const stories: StoriesData['stories'] = [];

  if (recentPlayedTracks.length) {
    stories.push(
      ...recentPlayedTracks.map(track => ({
        slug: `${STORY_RECENT_PLAYED_PREFIX_SLUG}-${track.id}` as const,
        title: `Recently Played`,
        timestamp: track.playedAt,
        detail: track,
      })),
    );
  }

  if (spotifyNowPlaying?.previewURL) {
    stories.push({
      slug: STORY_NOW_PLAYING_SLUG,
      title: 'Now Playing',
      detail: {
        ...spotifyNowPlaying,
        previewURL: spotifyNowPlaying.previewURL,
      },
    });
  }

  if (!stories.length) {
    throw redirect('/', { status: 307 });
  }

  const data: StoriesData = {
    initialActiveIndex: 0,
    stories,
  };

  const url = parseURL(request);
  const pathname = url.pathname.replace(/\/$/, '');

  const initialActiveIndex = data.stories.findIndex(story => {
    return `/stories/${story.slug}` === pathname;
  });

  if (initialActiveIndex < 0) {
    const initialActiveSlug = (
      await getStoriesSession(request)
    ).getLastOpenedStory();

    let initialActiveIndexFromCookie = 0;
    if (initialActiveSlug) {
      initialActiveIndexFromCookie = stories.findIndex(
        story => story.slug === initialActiveSlug,
      );
      if (initialActiveIndexFromCookie < 0) {
        initialActiveIndexFromCookie = 0;
      }
    }

    throw redirect(
      `/stories/${data.stories[initialActiveIndexFromCookie].slug}`,
      {
        status: 307,
      },
    );
  }

  data.initialActiveIndex = initialActiveIndex;

  return data;
};

export { default } from '~/pages/stories';
