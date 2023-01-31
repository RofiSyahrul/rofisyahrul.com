import type {
  SpotifyNowPlayingData,
  SpotifyRecentlyPlayedTrack,
} from './spotify';

export interface GenericStoryItem<
  TSlug extends string = string,
  TDetail = any,
> {
  slug: TSlug;
  title: string;
  timestamp?: string;
  detail: TDetail;
}

interface SpotifyNowPlayingDataWithPreviewURL
  extends Omit<SpotifyNowPlayingData, 'previewURL'> {
  previewURL: string;
}

export const STORY_NOW_PLAYING_SLUG = 'spotify-now-playing' as const;
export const STORY_RECENT_PLAYED_PREFIX_SLUG =
  'spotify-recent' as const;

export type NowPlayingStoryItem = GenericStoryItem<
  typeof STORY_NOW_PLAYING_SLUG,
  SpotifyNowPlayingDataWithPreviewURL
>;

export type RecentPlayedStoryItem = GenericStoryItem<
  `${typeof STORY_RECENT_PLAYED_PREFIX_SLUG}-${string}`,
  SpotifyRecentlyPlayedTrack
>;

export interface StoriesData {
  initialActiveIndex: number;
  stories: (RecentPlayedStoryItem | NowPlayingStoryItem)[];
}
