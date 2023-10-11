import { optimizeImage } from '@/shared/lib/image';
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

const MAX_IMAGE_SIZE = 300;
const SIZE_RATIO_PER_RANK = 10;

export const getServerResponse: GetServerResponse<
  TopTrackStoryProps
> = async ({ cookies, locals, params, redirect }) => {
  const { topTrackSlug = '' } = params;
  const { isSupportAvif } = locals.userAgent;

  const topTracks = await spotifyAPI.getTopTracks();
  if (!topTracks.length) return redirect('/', 307);

  const topTrackStories: TopTrackStoryItem[] = await Promise.all(
    topTracks.map(async topTrack => {
      if (topTrack.image?.url) {
        const size =
          MAX_IMAGE_SIZE - (topTrack.rank - 1) * SIZE_RATIO_PER_RANK;

        const optimizedImage = await optimizeImage({
          height: size,
          isSupportAvif,
          src: topTrack.image.url,
          width: size,
        });

        topTrack.image = {
          height: size,
          url: optimizedImage.src,
          width: size,
        };
      }

      return {
        slug: `${TOP_TRACK_PREFIX_SLUG}-${topTrack.rank}`,
        title: `Top Track #${topTrack.rank}`,
        detail: topTrack,
      };
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
