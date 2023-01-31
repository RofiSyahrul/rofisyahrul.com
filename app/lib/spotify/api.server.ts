import dayjs from 'dayjs';

import type {
  SpotifyNowPlaingResponse,
  SpotifyNowPlayingData,
  SpotifyRecentlyPlayedItem,
  SpotifyRecentlyPlayedResponse,
  SpotifyRecentlyPlayedTrack,
} from '~/types/spotify';

import { SpotifyAuth } from './auth.server';
import type { FetcherParams } from './fetcher.server';
import { SpotifyFetcher } from './fetcher.server';

function isTrackHasPreview(
  item: SpotifyRecentlyPlayedItem,
): item is SpotifyRecentlyPlayedItem<string> {
  return !!item.track.preview_url;
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
      const response = await this.fetcher<SpotifyNowPlaingResponse>({
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
    } catch (error) {
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
          isTrackHasPreview(item) &&
          !trackIds.includes(item.track.id)
        ) {
          items.push(item);
          trackIds.push(item.track.id);
        }

        return false;
      });

      return items;
    } catch (error) {
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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        `Failed to get recently played tracks. Error: ${error?.message}`,
      );
      return [];
    }
  }
}

export const spotifyAPI = new SpotifyAPI();
