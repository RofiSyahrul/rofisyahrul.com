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
