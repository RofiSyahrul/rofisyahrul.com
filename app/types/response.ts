import type { MediaResourceType } from './general';

export interface Pagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface Meta {
  pagination: Pagination;
}

export interface Item<Attr> {
  id: number;
  attributes: Attr;
}

export interface GeneralResponse<Attr> {
  data: Item<Attr>[];
  meta: Meta;
}

export interface MediaAttributes {
  name: string;
  alternativeText: string;
  height: number;
  provider_metadata: {
    public_id: string;
    resource_type: MediaResourceType;
  };
  width: number;
}

export type MediaItem = Item<MediaAttributes>;

export type SingleMediaResource<IsRequired extends boolean = false> =
  {
    data: IsRequired extends true ? MediaItem : MediaItem | null;
  };

export type MultipleMediaResource<
  IsRequired extends boolean = false,
> = {
  data: IsRequired extends true ? MediaItem[] : MediaItem[] | null;
};

export interface TechStackFields {
  name: string;
  url: string | null;
}

export interface PortfolioFields {
  description: string;
  highlightDescription: string | null;
  initialDate: string;
  repository: string | null;
  slug: string;
  title: string;
  url: string | null;
}
