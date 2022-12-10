import { limitPad } from '@cloudinary/url-gen/actions/resize';

import { cld } from '~/lib/cloudinary';
import type { SimpleMediaItem } from '~/types/general';
import type { MediaItem } from '~/types/response';

export default function parseMediaResource(params: {
  height?: number;
  media?: MediaItem | null;
  title: string;
  width?: number;
}): SimpleMediaItem {
  const { height, media, title, width } = params;

  if (!media) {
    return {
      alt: title,
      height: height ?? 32,
      mime: '',
      resourceType: 'image',
      url: '',
      width: width ?? 32,
    };
  }

  const attr = media.attributes;
  const { alternativeText, mime, name, provider_metadata } = attr;
  const alt = alternativeText || name || title;
  const mediaHeight = height ?? attr.height;
  const mediaWidth = width ?? attr.width;
  const resourceType = provider_metadata.resource_type;
  const publicID = provider_metadata.public_id;

  if (!publicID) {
    return {
      alt,
      height: mediaHeight,
      mime,
      resourceType,
      url: '',
      width: mediaWidth,
    };
  }

  let mediaURL = '';
  switch (resourceType) {
    case 'video': {
      const video = cld.video(publicID);
      mediaURL = video
        .resize(limitPad().width(mediaWidth).height(mediaHeight))
        .toURL();
      break;
    }
    case 'image':
    default: {
      const image = cld.image(publicID);
      mediaURL = image
        .resize(limitPad().width(mediaWidth).height(mediaHeight))
        .format('auto')
        .toURL();
    }
  }

  return {
    alt,
    height: mediaHeight,
    mime,
    resourceType,
    url: mediaURL,
    width: mediaWidth,
  };
}
