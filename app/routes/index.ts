import type { LinksFunction, LoaderFunction } from 'remix';

import { buildLinks } from '~/lib/links';
import type { HomeData } from '~/pages/home/types';
import { fetchPortfolioFeeds } from '~/repositories/portfolio/fetcher.server';
import { fetchProfile } from '~/repositories/profile/fetcher.server';
import homeStyleURL from '~/styles/home.css';

export const links: LinksFunction = () => {
  return buildLinks([homeStyleURL]);
};

export const loader: LoaderFunction = async () => {
  const [profile, portfolio] = await Promise.all([
    fetchProfile(),
    fetchPortfolioFeeds(),
  ]);

  const data: HomeData = {
    profile,
    portfolio,
  };

  return data;
};

export { default } from '~/pages/home';
