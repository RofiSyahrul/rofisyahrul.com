import type { LinksFunction } from 'remix';

import homeStyleURL from '~/styles/home.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: homeStyleURL }];
};

export { default } from '~/pages/home';
