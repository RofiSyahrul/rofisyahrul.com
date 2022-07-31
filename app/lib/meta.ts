import type { HtmlMetaDescriptor } from 'remix';

export const defaultTitle = 'Syahrul Rofi';
export const defaultDescription = `A Software Engineer and frontend web development enthusiast`;
export const defaultDarkImageURL = `https://res.cloudinary.com/rofi/image/upload/c_fit,q_auto:eco,r_8,w_720/v1654973302/rofisyahrul.com/social-image-dark.png`;
export const defaultLightImageURL = `https://res.cloudinary.com/rofi/image/upload/c_fit,q_auto:eco,r_8,w_720/v1654973281/rofisyahrul.com/social-image-light.png`;
export const defaultKeyword = `Rofi, Syahrul Rofi, Frontend Developer, Personal Web, Frontend Engineer, Front-End Engineer`;

function buildCanonicalUrl(pathname = '') {
  let host =
    typeof window === 'undefined'
      ? process.env.APP_URL
      : window.ENV?.APP_URL;
  if (!host) host = 'https://rofisyahrul.com';
  const url = `${host}${pathname}`;
  return url;
}

interface BuildMetaParam {
  description?: string;
  image?: string;
  keyword?: string;
  pathname?: string;
  shouldHideTitle?: boolean;
  title?: string;
}

const site = 'rofisyahrul.com';

export function buildMeta({
  description = defaultDescription,
  image = defaultLightImageURL,
  keyword = defaultKeyword,
  pathname = '/',
  shouldHideTitle = false,
  title = defaultTitle,
}: BuildMetaParam = {}): HtmlMetaDescriptor {
  const metaTitle =
    title === defaultTitle ? title : `${title} | ${defaultTitle}`;
  const url = buildCanonicalUrl(pathname);
  const sanitizedDescription = description.replace(
    /(<([^>]+)>)/gi,
    '',
  );

  return {
    ...(!shouldHideTitle && { title: metaTitle }),
    'og:title': metaTitle,
    'twitter:title': metaTitle,
    ...(url && { 'og:url': url }),
    description: sanitizedDescription,
    'og:description': sanitizedDescription,
    'twitter:description': sanitizedDescription,
    'og:image': image,
    'twitter:image': image,
    'twitter:card': 'summary_large_image',
    'twitter:creator': '@RofiSyahrul',
    'twitter:site': site,
    site,
    'og:site': site,
    keywords: keyword,
  };
}
