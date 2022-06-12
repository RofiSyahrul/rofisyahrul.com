import type { HtmlLinkDescriptor, LinkDescriptor } from 'remix';

type StylesheetDescriptor = string | Omit<HtmlLinkDescriptor, 'rel'>;

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

    return { rel, ...style };
  });

  return [...linkDescriptors, ...styleDescriptors];
}
