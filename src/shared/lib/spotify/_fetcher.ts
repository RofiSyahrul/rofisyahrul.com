export interface FetcherParams {
  body?: Record<string, any> | FormData | URLSearchParams;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, any>;
}

export class SpotifyFetcher {
  private baseURL = 'https://api.spotify.com';
  private countPathCallMap = new Map<string, number>();

  protected log(...args: unknown[]) {
    if (import.meta.env.SPOTIFY_VERBOSE_FETCH) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  }

  private getURL(path: string, query?: Record<string, any>) {
    const url = new URL(path, this.baseURL);

    if (query && typeof query === 'object') {
      for (const key in query) {
        const value = query[key];
        if (value) {
          url.searchParams.set(
            key,
            typeof value === 'string' ? value : JSON.stringify(value),
          );
        }
      }
    }

    return url.href;
  }

  private getRequestBody(
    body?: FetcherParams['body'],
  ): string | URLSearchParams | undefined {
    if (!body) return undefined;
    if (body instanceof URLSearchParams) {
      return body;
    }
    return JSON.stringify(body);
  }

  private async getErrorResponse(
    response: Response,
  ): Promise<string> {
    const text = await response.clone().text();
    const message = `Status: ${response.status}. ${text}`;
    this.log('Error.', message, '\n');
    return message;
  }

  protected async fetcher<T>({
    body,
    headers,
    method = 'GET',
    path,
    query,
  }: FetcherParams): Promise<T> {
    const url = this.getURL(path, query);
    const reqBody = this.getRequestBody(body);
    let countPathCall = this.countPathCallMap.get(path) ?? 0;
    countPathCall += 1;
    this.countPathCallMap.set(path, countPathCall);

    this.log(
      ...[
        '\n',
        '#' + countPathCall,
        method,
        path,
        '\n',
        method,
        url,
        reqBody ? `\nBody: ${reqBody.toString()}` : undefined,
        headers
          ? `\nHeaders: ${JSON.stringify(headers, null, 2)}`
          : undefined,
        '\n',
      ].filter(Boolean),
    );

    const response = await fetch(url, {
      body: reqBody,
      headers,
      method,
    });

    if (!response.ok) {
      throw new Error(await this.getErrorResponse(response));
    }

    try {
      const data: T = await response.clone().json();
      return data;
    } catch (error) {
      throw new Error(await this.getErrorResponse(response));
    }
  }
}
