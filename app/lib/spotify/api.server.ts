import { SpotifyAuth } from './auth.server';
import type { FetcherParams } from './fetcher.server';
import { SpotifyFetcher } from './fetcher.server';
import type {
  SpotifyNowPlaingResponse,
  SpotifyNowPlayingData,
} from './types';

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
        title: response.item.name,
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
}

export const spotifyAPI = new SpotifyAPI();
