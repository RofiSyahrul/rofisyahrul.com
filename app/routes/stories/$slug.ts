import type { MetaFunction } from '@remix-run/server-runtime';

import { buildMeta } from '~/lib/meta';
import type { StoriesData } from '~/types/stories';

export { default } from '~/pages/stories-spotify';

export const meta: MetaFunction = ({ parentsData, params }) => {
  const storiesData: StoriesData = parentsData['routes/stories'];
  if (!storiesData) return buildMeta();

  const { slug } = params;

  const { title } =
    storiesData.stories?.find(story => story.slug === slug) ?? {};

  if (!title) return buildMeta();

  return buildMeta({ title });
};
