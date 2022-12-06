import fetch from '@remix-run/web-fetch';
import { stringify } from 'qs';

import type { GeneralResponse, Pagination } from '~/types/response';

import { API_URL } from './__config';

type FilterFields = Record<string, any>;
type PopulatedFields = Record<string, any>;

type FilterOperator =
  | '$eq'
  | '$eqi'
  | '$ne'
  | '$lt'
  | '$lte'
  | '$gt'
  | '$gte'
  | '$contains'
  | '$notContains'
  | '$containsi'
  | '$notContainsi'
  | '$null'
  | '$notNull'
  | '$between'
  | '$startsWith'
  | '$endsWith';

type BaseFilterOperation<
  F extends FilterFields = FilterFields,
  K extends keyof F = keyof F,
> = Partial<Record<FilterOperator, F[K]>> & {
  $in?: Array<F[K]>;
  $notIn?: Array<F[K]>;
};

type FilterOperation<
  F extends FilterFields = FilterFields,
  K extends keyof F = keyof F,
> =
  | BaseFilterOperation<F, K>
  | {
      $and?: BaseFilterOperation<F, K>;
    }
  | {
      $or?: BaseFilterOperation<F, K>;
    };

type QueryFilter<F extends FilterFields = FilterFields> = {
  id?: BaseFilterOperation<any, number>;
} & {
  [K in keyof F]?: FilterOperation<F, K>;
};

interface FetcherQuery<
  F extends FilterFields = FilterFields,
  P extends PopulatedFields = PopulatedFields,
> {
  fields?: Array<keyof F>;
  filters?: QueryFilter<F>;
  populate?:
    | Array<keyof P>
    | ({ [k in keyof P]?: { populate: string[] } } & Array<keyof P>);
  pagination?: Partial<Pick<Pagination, 'page' | 'pageSize'>>;
  sort?: Array<
    keyof F | `${keyof F extends string ? keyof F : string}:desc`
  >;
}

interface FetcherParams<
  F extends FilterFields = FilterFields,
  P extends PopulatedFields = PopulatedFields,
> {
  path: string;
  query?: FetcherQuery<F, P>;
}

function parseURL(path: string, query?: Record<string, any>) {
  if (!query) return `${API_URL}${path}`;

  const queryString = stringify(query, { encodeValuesOnly: true });
  return `${API_URL}${path}?${queryString}`;
}

export default async function fetcher<
  T = GeneralResponse<Record<string, any>>,
  F extends FilterFields = FilterFields,
  P extends PopulatedFields = PopulatedFields,
>({ path, query }: FetcherParams<F, P>): Promise<T> {
  const url = parseURL(path, query);

  const response = await fetch(url, {
    method: 'GET',
  });

  const data = await response.json();
  return data;
}
