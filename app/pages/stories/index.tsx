import { useCallback, useRef } from 'react';

import { Outlet, useFetcher, useLoaderData } from '@remix-run/react';

import StoriesLayout from '~/layouts/stories-layout';
import type { StoriesCloseHandler } from '~/store/stories';
import type { StoriesData } from '~/types/stories';

function buildStoryPathname(slug: string) {
  return `/stories/${slug}`;
}

export default function StoriesPage() {
  const { initialActiveIndex, stories } =
    useLoaderData<StoriesData>();

  const { submit } = useFetcher();
  const submitRef = useRef(submit);

  const handleStoriesClose = useCallback<StoriesCloseHandler>(
    ({ activeStory, isNextStoryAvailable }) => {
      submitRef.current(
        {
          lastOpenedStory: isNextStoryAvailable
            ? activeStory.slug
            : '',
        },
        { action: '/action/set-last-opened-story', method: 'post' },
      );
    },
    [],
  );

  return (
    <StoriesLayout
      buildStoryPathname={buildStoryPathname}
      initialActiveIndex={initialActiveIndex}
      onClose={handleStoriesClose}
      stories={stories}
    >
      <Outlet />
    </StoriesLayout>
  );
}
