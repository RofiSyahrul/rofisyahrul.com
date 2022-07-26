import { stringify } from 'qs';

import serverConfig from '~/config.server';

import { FetchError } from './utils.server';

interface FetcherParams {
  path: string;
  query?: Record<string, any>;
}

function parseURL(path: string, query?: Record<string, any>) {
  if (!query) return `${serverConfig.apiURL}${path}`;

  const queryString = stringify(query, { encodeValuesOnly: true });
  return `${serverConfig.apiURL}${path}?${queryString}`;
}

export default async function fetcher<T>({
  path,
  query,
}: FetcherParams): Promise<T> {
  const response = await fetch(parseURL(path, query), {
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
