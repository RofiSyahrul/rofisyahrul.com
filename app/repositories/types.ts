import type { Pagination } from '~/types/response';

type Fields = Record<string, any>;

export interface FetcherQuery<
  F extends Fields = Fields,
  P extends Fields = Fields,
> {
  fields?: Array<keyof F>;
  populate?: Array<keyof P>;
  pagination?: Partial<Pick<Pagination, 'page' | 'pageCount'>>;
  sort?: Array<
    keyof F | `${keyof F extends string ? keyof F : string}:desc`
  >;
}

export interface FetcherParams<
  F extends Fields = Fields,
  P extends Fields = Fields,
> {
  path: string;
  query?: FetcherQuery<F, P>;
}
