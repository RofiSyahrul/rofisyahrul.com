import type { AstroGlobal } from 'astro';

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type LiteralUnion<LiteralType, BaseType extends Primitive> =
  | LiteralType
  | (BaseType & Record<never, never>);

export type ServerResponse<P extends object> =
  | { props: P }
  | Response;

export type GetServerData<P extends object> = (
  astro: AstroGlobal,
) => P | Promise<P>;

export type GetServerResponse<P extends object> = (
  astro: AstroGlobal,
) => ServerResponse<P> | Promise<ServerResponse<P>>;

export type MediaResourceType = 'image' | 'video';

export interface SimpleMediaItem {
  alt: string;
  height: number;
  mime: string;
  resourceType: MediaResourceType;
  url: string;
  width: number;
}
