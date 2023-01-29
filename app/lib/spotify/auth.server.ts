import dayjs from 'dayjs';

import { SpotifyFetcher } from './fetcher.server';

interface Credentials {
  accessToken: string;
  expiredAt: string;
}

export class SpotifyAuth extends SpotifyFetcher {
  private clientID = process.env.SPOTIFY_CLIENT_ID ?? '';
  private clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? '';
  private refreshToken = process.env.SPOTIFY_REFRESH_TOKEN ?? '';
  private credentials: Credentials | undefined;

  private get authToken() {
    return Buffer.from(
      `${this.clientID}:${this.clientSecret}`,
    ).toString('base64');
  }

  private async fetchCredentials(): Promise<Credentials> {
    const response = await this.fetcher<{
      access_token: string;
      expires_in: number;
    }>({
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      }),
      headers: {
        Authorization: `Basic ${this.authToken}`,
      },
      path: 'https://accounts.spotify.com/api/token',
    });

    return {
      accessToken: response.access_token,
      expiredAt: dayjs()
        .add(response.expires_in - 60, 'second')
        .toISOString(),
    };
  }

  private async getCredentials(): Promise<Credentials> {
    if (
      this.credentials &&
      dayjs().isBefore(dayjs(this.credentials.expiredAt))
    ) {
      return this.credentials;
    }

    this.credentials = await this.fetchCredentials();
    return this.credentials;
  }

  async getHeaders(): Promise<{ Authorization: string }> {
    const { accessToken } = await this.getCredentials();
    return { Authorization: `Bearer ${accessToken}` };
  }
}
