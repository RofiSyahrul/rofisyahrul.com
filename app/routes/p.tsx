import { lazy, Suspense } from 'react';

import { Outlet } from '@remix-run/react';

import { useUserAgent } from '~/contexts/user-agent';

export { links } from '~/pages/home/links';

const HomePage = lazy(() => import('~/pages/home'));

export default function PortfolioRoutes() {
  const { isMobile } = useUserAgent();
  if (isMobile) return <Outlet />;

  return (
    <>
      <Suspense>
        <HomePage />
      </Suspense>
      <Outlet />
    </>
  );
}
