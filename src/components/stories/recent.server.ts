import { optimizeImage } from '@/shared/lib/image';
import { spotifyAPI } from '@/shared/lib/spotify';
import { storiesConfigMapping } from '@/shared/lib/stories';
import type { InitStoriesStoreParams } from '@/shared/stores/stories';
import type { GetServerResponse } from '@/shared/types/general';
import type {
  NowPlayingStoryItem,
  RecentPlayedStoryItem,
} from '@/shared/types/stories';
import {
  STORY_NOW_PLAYING_SLUG,
  STORY_RECENT_PLAYED_PREFIX_SLUG,
} from '@/shared/types/stories';

export type StoryRecentProps = Pick<
  InitStoriesStoreParams,
  'initialActiveIndex' | 'stories'
>;

type RecentStoryItem = RecentPlayedStoryItem | NowPlayingStoryItem;

const IMAGE_SIZE = 250;

async function getTrackWithOptimizedImage<
  T extends RecentStoryItem['detail'],
>({
  isSupportAvif,
  track,
}: {
  isSupportAvif: boolean;
  track: T;
}): Promise<T> {
  if (!track.image?.url) {
    return track;
  }

  try {
    const optimizedImage = await optimizeImage({
      height: IMAGE_SIZE,
      isSupportAvif,
      src: track.image.url,
      width: IMAGE_SIZE,
    });

    track.image = {
      height: optimizedImage.options.height || IMAGE_SIZE,
      url: optimizedImage.src,
      width: optimizedImage.options.width || IMAGE_SIZE,
    };

    return track;
  } catch {
    return track;
  }
}

export const getServerResponse: GetServerResponse<
  StoryRecentProps
> = async ({ cookies, locals, params, redirect }) => {
  const { storySlug = '' } = params;
  const { isSupportAvif } = locals.userAgent;

  const [spotifyNowPlaying, recentPlayedTracks] = await Promise.all([
    spotifyAPI.getNowPlaying(),
    spotifyAPI.getRecentlyPlayedTracks(),
  ]);

  const storyPromises: Promise<RecentStoryItem>[] = [];

  if (recentPlayedTracks.length) {
    storyPromises.push(
      ...recentPlayedTracks.map<Promise<RecentPlayedStoryItem>>(
        async track => {
          return {
            slug: `${STORY_RECENT_PLAYED_PREFIX_SLUG}-${track.id}` as const,
            title: `Recently Played`,
            timestamp: track.playedAt,
            detail: await getTrackWithOptimizedImage({
              isSupportAvif,
              track,
            }),
          };
        },
      ),
    );
  }

  if (spotifyNowPlaying?.previewURL) {
    const nowPlayingStory: NowPlayingStoryItem = {
      slug: STORY_NOW_PLAYING_SLUG,
      title: 'Now Playing',
      detail: {
        ...spotifyNowPlaying,
        previewURL: spotifyNowPlaying.previewURL,
      },
    };

    storyPromises.push(
      new Promise<RecentStoryItem>(resolve => {
        getTrackWithOptimizedImage({
          isSupportAvif,
          track: nowPlayingStory.detail,
        }).then(detail => {
          nowPlayingStory.detail = detail;
          resolve(nowPlayingStory);
        });
      }),
    );
  }

  if (!storyPromises.length) return redirect('/', 307);

  const stories = await Promise.all(storyPromises);
  const slugToIndexMap = new Map<string, number>(
    stories.map((story, index) => [story.slug, index]),
  );

  let initialActiveIndex = slugToIndexMap.get(storySlug);

  if (typeof initialActiveIndex === 'number') {
    return {
      props: {
        initialActiveIndex,
        stories,
      },
    };
  }

  const { cookieKey, pathPrefix } = storiesConfigMapping.recent;
  const cookieValue = cookies.get(cookieKey);
  const latestActiveSlug = cookieValue?.value;

  initialActiveIndex =
    (latestActiveSlug && slugToIndexMap.get(latestActiveSlug)) || 0;

  return redirect(pathPrefix + stories[initialActiveIndex].slug, 307);
};
