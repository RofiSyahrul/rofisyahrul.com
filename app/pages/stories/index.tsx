import { Outlet, useLoaderData } from '@remix-run/react';

import StoriesLayout from '~/layouts/stories-layout';
import type { StoriesData } from '~/types/stories';

function buildStoryPathname(slug: string) {
  return `/stories/${slug}`;
}

export default function StoriesPage() {
  const { initialActiveIndex, stories } =
    useLoaderData<StoriesData>();

  return (
    <StoriesLayout
      buildStoryPathname={buildStoryPathname}
      initialActiveIndex={initialActiveIndex}
      stories={stories}
    >
      <Outlet />
    </StoriesLayout>
  );
}
