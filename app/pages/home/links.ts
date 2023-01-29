import type { LinksFunction } from '@remix-run/server-runtime';

import { buildLinks } from '~/lib/links';
import homeStyleURL from '~/styles/home.css';

export const links: LinksFunction = () => {
  return buildLinks([homeStyleURL]);
};
