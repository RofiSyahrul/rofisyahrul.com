export interface FetcherParams {
  body?: Record<string, any> | FormData | URLSearchParams;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, any>;
}

export class SpotifyFetcher {
  private baseURL = 'https://api.spotify.com';

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
  ): BodyInit | undefined {
    if (!body) return undefined;
    if (body instanceof FormData || body instanceof URLSearchParams) {
      return body;
    }
    return JSON.stringify(body);
  }

  private async getErrorResponse(
    response: Response,
  ): Promise<string> {
    const text = await response.clone().text();
    return `Status: ${response.status}. ${text}`;
  }

  protected async fetcher<T>({
    body,
    headers,
    method = 'GET',
    path,
    query,
  }: FetcherParams): Promise<T> {
    const response = await fetch(this.getURL(path, query), {
      body: this.getRequestBody(body),
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
