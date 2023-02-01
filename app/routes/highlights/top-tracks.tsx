import { useCallback, useRef } from 'react';

import { Outlet, useFetcher, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';

import StoriesLayout from '~/layouts/stories-layout';
import { getHighlightsSession } from '~/lib/cookies/highlights.server';
import { spotifyAPI } from '~/lib/spotify/api.server';
import type { StoriesCloseHandler } from '~/store/stories';
import { HIGHLIGHT_TOP_TRACKS } from '~/types/highlights';
import type { TopTrackStoryItem } from '~/types/stories';
import { TOP_TRACK_PREFIX_SLUG } from '~/types/stories';
import parseURL from '~/utils/parse-url.server';

function buildStoryPathname(slug: string) {
  return `/highlights/top-tracks/${slug}`;
}

export async function loader({ request }: LoaderArgs) {
  const topTracks = await spotifyAPI.getTopTracks();

  if (!topTracks.length) {
    throw redirect('/', { status: 307 });
  }

  const url = parseURL(request);
  const pathname = url.pathname.replace(/\/$/, '');

  const topTrackStories: TopTrackStoryItem[] = topTracks.map(
    track => ({
      slug: `${TOP_TRACK_PREFIX_SLUG}-${track.rank}`,
      title: `Top Track #${track.rank}`,
      detail: track,
    }),
  );

  const initialActiveIndex = topTrackStories.findIndex(story => {
    return buildStoryPathname(story.slug) === pathname;
  });

  if (initialActiveIndex >= 0) {
    return {
      initialActiveIndex,
      topTrackStories,
    };
  }

  const session = await getHighlightsSession(request);
  const initialActiveSlug = session.getLastOpened(
    HIGHLIGHT_TOP_TRACKS,
  );

  let initialActiveIndexFromCookie = 0;
  if (initialActiveSlug) {
    initialActiveIndexFromCookie = topTrackStories.findIndex(
      story => story.slug === initialActiveSlug,
    );
    if (initialActiveIndexFromCookie < 0) {
      initialActiveIndexFromCookie = 0;
    }
  }

  throw redirect(
    buildStoryPathname(
      topTrackStories[initialActiveIndexFromCookie].slug,
    ),
    { status: 307 },
  );
}

export type TopTracksLoader = typeof loader;

export default function TopTracksPage() {
  const { initialActiveIndex, topTrackStories } =
    useLoaderData<TopTracksLoader>();

  const { submit } = useFetcher();
  const submitRef = useRef(submit);

  const handleClose = useCallback<StoriesCloseHandler>(
    ({ activeStory, isNextStoryAvailable }) => {
      submitRef.current(
        {
          name: HIGHLIGHT_TOP_TRACKS,
          value: isNextStoryAvailable ? activeStory.slug : '',
        },
        {
          action: '/action/set-last-opened-highlight',
          method: 'post',
        },
      );
    },
    [],
  );

  return (
    <StoriesLayout
      buildStoryPathname={buildStoryPathname}
      name={HIGHLIGHT_TOP_TRACKS}
      onClose={handleClose}
      stories={topTrackStories}
      initialActiveIndex={initialActiveIndex}
    >
      <Outlet />
    </StoriesLayout>
  );
}
