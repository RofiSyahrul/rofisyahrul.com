import type {
  SpotifyNowPlayingData,
  SpotifyRecentlyPlayedTrack,
  SpotifyTopTrackItem,
} from './spotify';

export interface GenericStoryItem<
  TSlug extends string = string,
  TDetail extends Record<string, any> = any,
> {
  detail: TDetail;
  slug: TSlug;
  title: string;
  timestamp?: string;
}

interface SpotifyNowPlayingDataWithPreviewURL
  extends Omit<SpotifyNowPlayingData, 'previewURL'> {
  previewURL: string;
}

export const STORY_NOW_PLAYING_SLUG = 'spotify-now-playing' as const;
export const STORY_RECENT_PLAYED_PREFIX_SLUG =
  'spotify-recent' as const;

export const TOP_TRACK_PREFIX_SLUG = 'spotify-top-track' as const;

export type NowPlayingStoryItem = GenericStoryItem<
  typeof STORY_NOW_PLAYING_SLUG,
  SpotifyNowPlayingDataWithPreviewURL
>;

export type RecentPlayedStoryItem = GenericStoryItem<
  `${typeof STORY_RECENT_PLAYED_PREFIX_SLUG}-${string}`,
  SpotifyRecentlyPlayedTrack
>;

export type TopTrackStoryItem = GenericStoryItem<
  `${typeof TOP_TRACK_PREFIX_SLUG}-${number}`,
  SpotifyTopTrackItem
>;
