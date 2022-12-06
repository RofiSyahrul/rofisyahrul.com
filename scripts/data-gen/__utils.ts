import path from 'path';

import type {
  Item,
  MediaItem,
  MultipleMediaResource,
  SingleMediaResource,
} from '~/types/response';

export { default as fs } from 'fs/promises';
export { path };

function transformMediaItem({
  attributes,
  id,
}: MediaItem): MediaItem {
  return {
    id: id,
    attributes: {
      alternativeText: attributes.alternativeText,
      height: attributes.height ?? 0,
      mime: attributes.mime,
      name: attributes.name,
      provider_metadata: attributes.provider_metadata,
      width: attributes.width ?? 0,
    },
  };
}

export function transformSingleMediaResource<T extends boolean>(
  resource: SingleMediaResource<T>,
): SingleMediaResource<T> {
  if (resource.data) {
    return { data: transformMediaItem(resource.data) };
  }

  return { data: null as any };
}

export function transformMultipleMediaResource<T extends boolean>(
  resource: MultipleMediaResource<T>,
): MultipleMediaResource<T> {
  if (resource.data) {
    return { data: resource.data.map(transformMediaItem) };
  }

  return { data: null as any };
}

export function omitTimestampFields<Attr>(
  item: Item<Attr>,
): Item<Attr> {
  const {
    createdAt: _,
    updatedAt: __,
    ...attributes
  } = item.attributes as Record<string, unknown>;

  return {
    id: item.id,
    attributes: attributes as Attr,
  };
}

export function getRelativePath(pathname: string): string {
  return path.relative(process.cwd(), pathname);
}
