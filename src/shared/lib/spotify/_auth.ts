import dayjs from 'dayjs';

import { SpotifyFetcher } from './_fetcher';

interface Credentials {
  accessToken: string;
  expiredAt: string;
}

export class SpotifyAuth extends SpotifyFetcher {
  private clientID = import.meta.env.SPOTIFY_CLIENT_ID ?? '';
  private clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET ?? '';
  private refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN ?? '';
  private credentials: Credentials | undefined;
  private credentialsPromise: Promise<Credentials> | undefined;

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
      this.credentialsPromise = undefined;
      return this.credentials;
    }

    this.credentialsPromise ??= this.fetchCredentials();
    this.credentials = await this.credentialsPromise;
    return this.credentials;
  }

  async getHeaders(): Promise<{ Authorization: string }> {
    const { accessToken } = await this.getCredentials();
    return { Authorization: `Bearer ${accessToken}` };
  }
}
