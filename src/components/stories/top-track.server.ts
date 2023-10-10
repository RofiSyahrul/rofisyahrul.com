import { spotifyAPI } from '@/shared/lib/spotify';
import { storiesConfigMapping } from '@/shared/lib/stories';
import type { GetServerResponse } from '@/shared/types/general';
import {
  TOP_TRACK_PREFIX_SLUG,
  type TopTrackStoryItem,
} from '@/shared/types/stories';

export interface TopTrackStoryProps {
  initialActiveIndex: number;
  topTrackStories: TopTrackStoryItem[];
}

export const getServerResponse: GetServerResponse<
  TopTrackStoryProps
> = async ({ cookies, params, redirect }) => {
  const { topTrackSlug = '' } = params;

  const topTracks = await spotifyAPI.getTopTracks();
  if (!topTracks.length) return redirect('/', 307);

  const topTrackStories: TopTrackStoryItem[] = topTracks.map(
    topTrack => ({
      slug: `${TOP_TRACK_PREFIX_SLUG}-${topTrack.rank}`,
      title: `Top Track #${topTrack.rank}`,
      detail: topTrack,
    }),
  );

  const slugToIndexMap = new Map<string, number>(
    topTrackStories.map((topTrack, index) => [topTrack.slug, index]),
  );

  let initialActiveIndex = slugToIndexMap.get(topTrackSlug);
  if (typeof initialActiveIndex === 'number') {
    return {
      props: {
        initialActiveIndex,
        topTrackStories,
      },
    };
  }

  const { cookieKey, pathPrefix } =
    storiesConfigMapping['top-tracks'];

  const cookieValue = cookies.get(cookieKey);
  const latestActiveSlug = cookieValue?.value;

  initialActiveIndex =
    (latestActiveSlug && slugToIndexMap.get(latestActiveSlug)) || 0;

  return redirect(
    pathPrefix + topTrackStories[initialActiveIndex].slug,
    307,
  );
};
