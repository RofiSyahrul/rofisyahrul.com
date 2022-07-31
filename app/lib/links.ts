import type { HtmlLinkDescriptor } from '@remix-run/react';
import type { LinkDescriptor, PageLinkDescriptor } from 'remix';

type StylesheetDescriptor =
  | string
  | Omit<HtmlLinkDescriptor | PageLinkDescriptor, 'rel'>;

export function buildLinks(
  styles: StylesheetDescriptor[] = [],
  linkDescriptors: LinkDescriptor[] = [],
): LinkDescriptor[] {
  const styleDescriptors = styles.map<LinkDescriptor>(style => {
    const rel = 'stylesheet';

    if (typeof style === 'string') {
      return {
        rel,
        href: style,
      };
    }

    return { rel, ...(style as any) };
  });

  return [...linkDescriptors, ...styleDescriptors];
}
