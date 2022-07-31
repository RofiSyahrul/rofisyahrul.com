import { stringify } from 'qs';

import serverConfig from '~/config.server';
import type { GeneralResponse } from '~/types/response';

import type { FetcherParams } from './types';
import { FetchError } from './utils.server';

function parseURL(path: string, query?: Record<string, any>) {
  if (!query) return `${serverConfig.apiURL}${path}`;

  const queryString = stringify(query, { encodeValuesOnly: true });
  return `${serverConfig.apiURL}${path}?${queryString}`;
}

export default async function fetcher<
  T = GeneralResponse<Record<string, any>>,
  F = Record<string, any>,
  P = Record<string, any>,
>({ path, query }: FetcherParams<F, P>): Promise<T> {
  const url = parseURL(path, query);

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Fetcher URL', url);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${serverConfig.apiToken}`,
    },
    method: 'GET',
  });

  const { status } = response;
  if (status >= 400 && status < 600) throw new FetchError(response);

  const data = await response.json();
  return data;
}
