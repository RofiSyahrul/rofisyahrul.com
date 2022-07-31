import type { Pagination } from '~/types/response';

type Fields = Record<string, any>;

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
  F extends Fields = Fields,
  K extends keyof F = keyof F,
> = Partial<Record<FilterOperator, F[K]>> & {
  $in?: Array<F[K]>;
  $notIn?: Array<F[K]>;
};

type FilterOperation<
  F extends Fields = Fields,
  K extends keyof F = keyof F,
> =
  | BaseFilterOperation<F, K>
  | {
      $and?: BaseFilterOperation<F, K>;
    }
  | {
      $or?: BaseFilterOperation<F, K>;
    };

export type QueryFilter<F extends Fields = Fields> = {
  id?: BaseFilterOperation<any, number>;
} & {
  [K in keyof F]?: FilterOperation<F, K>;
};

export interface FetcherQuery<
  F extends Fields = Fields,
  P extends Fields = Fields,
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

export interface FetcherParams<
  F extends Fields = Fields,
  P extends Fields = Fields,
> {
  path: string;
  query?: FetcherQuery<F, P>;
}
