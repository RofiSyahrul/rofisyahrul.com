import { lazy, Suspense } from 'react';

import { Outlet, useLocation } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';

import Loading from '~/components/loading';
import { useUserAgent } from '~/contexts/user-agent';
import { spotifyAPI } from '~/lib/spotify/api.server';
import type { HomeData } from '~/pages/home/types';
import { fetchPortfolioFeeds } from '~/repositories/portfolio/fetcher.server';
import { fetchProfile } from '~/repositories/profile/fetcher.server';
import { countTechSkills } from '~/repositories/tech-skill/fetcher.server';

export { links } from '~/pages/home/links';

const HomePage = lazy(() => import('~/pages/home'));

export const loader: LoaderFunction = async () => {
  const [profile, portfolio, totalTechSkills, spotifyNowPlaying] =
    await Promise.all([
      fetchProfile(),
      fetchPortfolioFeeds(),
      countTechSkills(),
      spotifyAPI.getNowPlaying(),
    ]);

  const data: HomeData = {
    portfolio,
    profile,
    spotifyNowPlaying,
    totalTechSkills,
  };

  return data;
};

export default function BaseLayout() {
  const { isMobile } = useUserAgent();
  const { pathname } = useLocation();
  const shouldRenderHomePage =
    !isMobile || pathname === '/' || pathname === '/portfolio-list';

  if (shouldRenderHomePage) {
    return (
      <>
        <Suspense fallback={<Loading variant='whole-page' />}>
          <HomePage />
        </Suspense>
        <Outlet />
      </>
    );
  }

  return <Outlet />;
}
