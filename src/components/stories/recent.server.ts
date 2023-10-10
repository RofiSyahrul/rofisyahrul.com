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

export const getServerResponse: GetServerResponse<
  StoryRecentProps
> = async ({ cookies, params, redirect }) => {
  const { storySlug = '' } = params;

  const [spotifyNowPlaying, recentPlayedTracks] = await Promise.all([
    spotifyAPI.getNowPlaying(),
    spotifyAPI.getRecentlyPlayedTracks(),
  ]);

  const stories: (RecentPlayedStoryItem | NowPlayingStoryItem)[] = [];

  if (recentPlayedTracks.length) {
    stories.push(
      ...recentPlayedTracks.map<RecentPlayedStoryItem>(track => ({
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

  if (!stories.length) return redirect('/', 307);

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
