import dayjs from 'dayjs';

import type {
  SpotifyNowPlayingData,
  SpotifyNowPlayingResponse,
  SpotifyRecentlyPlayedItem,
  SpotifyRecentlyPlayedResponse,
  SpotifyRecentlyPlayedTrack,
  SpotifyTopTrackItem,
  SpotifyTopTracksResponse,
  SpotifyTrack,
} from '@/shared/types/spotify';

import { SpotifyAuth } from './_auth';
import type { FetcherParams } from './_fetcher';
import { SpotifyFetcher } from './_fetcher';

function isTrackHasPreview(
  track: SpotifyTrack,
): track is SpotifyTrack<string> {
  return !!track.preview_url;
}

function isItemHasPreview(
  item: SpotifyRecentlyPlayedItem,
): item is SpotifyRecentlyPlayedItem<string> {
  return isTrackHasPreview(item.track);
}

class SpotifyAPI extends SpotifyFetcher {
  private auth = new SpotifyAuth();

  protected async fetcher<T>({
    headers,
    ...params
  }: FetcherParams): Promise<T> {
    const data = await super.fetcher<T>({
      ...params,
      headers: {
        ...(await this.auth.getHeaders()),
        ...headers,
      },
    });

    return data;
  }

  async getNowPlaying(): Promise<SpotifyNowPlayingData | null> {
    try {
      const response = await this.fetcher<SpotifyNowPlayingResponse>({
        path: `/v1/me/player/currently-playing`,
      });
      if (!response.is_playing) return null;
      return {
        albumName: response.item.album.name,
        artists: response.item.artists.map(artist => artist.name),
        image: response.item.album.images[0] ?? null,
        previewURL: response.item.preview_url,
        title: response.item.name,
        trackID: response.item.id,
        trackURL: response.item.external_urls.spotify,
      };
    } catch (error_) {
      const error = error_ as Error;
      // eslint-disable-next-line no-console
      console.log(
        `Failed to get current spotify track. Error: ${error?.message}`,
      );
      return null;
    }
  }

  private async getRecentlyPlayedRawData(): Promise<
    SpotifyRecentlyPlayedItem<string>[]
  > {
    try {
      const res = await this.fetcher<SpotifyRecentlyPlayedResponse>({
        path: `/v1/me/player/recently-played`,
        query: {
          after: dayjs().subtract(24, 'hours').unix(),
          limit: 50,
        },
      });

      const items: SpotifyRecentlyPlayedItem<string>[] = [];
      const trackIds: string[] = [];
      const maxItems = 5;

      res.items.some(item => {
        if (items.length >= maxItems) return true;

        if (
          isItemHasPreview(item) &&
          !trackIds.includes(item.track.id)
        ) {
          items.push(item);
          trackIds.push(item.track.id);
        }

        return false;
      });

      return items;
    } catch (error_) {
      const error = error_ as Error;
      // eslint-disable-next-line no-console
      console.log(
        `Failed to get recently played tracks. Error: ${error?.message}`,
      );
      return [];
    }
  }

  async hasRecentlyPlayedTracks(): Promise<boolean> {
    const items = await this.getRecentlyPlayedRawData();
    return items.length > 0;
  }

  async getRecentlyPlayedTracks(): Promise<
    SpotifyRecentlyPlayedTrack[]
  > {
    try {
      const items = await this.getRecentlyPlayedRawData();

      return items.reverse().map(item => ({
        albumName: item.track.album.name,
        artists: item.track.artists.map(artist => artist.name),
        id: item.track.id,
        image: item.track.album.images[0] ?? null,
        playedAt: item.played_at,
        previewURL: item.track.preview_url,
        title: item.track.name,
        trackURL: item.track.external_urls.spotify,
      }));
    } catch (error_) {
      const error = error_ as Error;
      // eslint-disable-next-line no-console
      console.log(
        `Failed to get recently played tracks. Error: ${error?.message}`,
      );
      return [];
    }
  }

  private async getTopTracksRawData(): Promise<
    SpotifyTrack<string>[]
  > {
    try {
      const res = await this.fetcher<SpotifyTopTracksResponse>({
        path: `/v1/me/top/tracks`,
        query: {
          limit: 50,
          time_range: 'short_term',
        },
      });

      const topTracks: SpotifyTrack<string>[] = [];
      const maxTracks = 10;

      for (const track of res.items) {
        if (topTracks.length >= maxTracks) break;
        if (isTrackHasPreview(track)) {
          topTracks.push(track);
        }
      }

      return topTracks;
    } catch (error_) {
      const error = error_ as Error;
      this.log(
        `Failed to get my spotify top tracks. ${error?.message}`,
      );
      return [];
    }
  }

  async hasTopTracks(): Promise<boolean> {
    const topTracks = await this.getTopTracksRawData();
    return topTracks.length > 0;
  }

  async getTopTracks(): Promise<SpotifyTopTrackItem[]> {
    const rawTopTracks = await this.getTopTracksRawData();
    return rawTopTracks.map((track, index) => ({
      albumName: track.album.name,
      artists: track.artists.map(artist => artist.name),
      id: track.id,
      image: track.album.images[0] ?? null,
      previewURL: track.preview_url,
      rank: index + 1,
      title: track.name,
      trackURL: track.external_urls.spotify,
    }));
  }
}

export const spotifyAPI = new SpotifyAPI();
