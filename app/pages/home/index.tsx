import { lazy, Suspense, useEffect, useState } from 'react';

import { useLocation, useOutletContext } from '@remix-run/react';

import Header from '~/components/header';
import { useUserAgent } from '~/contexts/user-agent';

import Bio from './bio';
import Counts from './counts';
import Highlights from './highlights';
import PortfolioGrid from './portfolios/grid';
import PortfolioList from './portfolios/list';
import {
  portfolioGridID,
  portfolioListID,
} from './tablist/constants';
import type { TabName } from './tablist/types';
import TopFold from './top-fold';

const Tablist = lazy(() => import('./tablist'));

export default function HomePage() {
  const outleteContext = useOutletContext();
  const isOutleteContextAvailable = !!outleteContext;

  const { isMobile } = useUserAgent();

  const { hash } = useLocation();
  const [selectedTab, setSelectedTab] = useState<TabName | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!isOutleteContextAvailable) window.location.reload();
  }, [isOutleteContextAvailable]);

  useEffect(() => {
    setSelectedTab(
      hash === `#${portfolioListID}` && isMobile ? 'list' : 'grid',
    );
  }, [hash, isMobile]);

  if (!isOutleteContextAvailable) {
    return (
      <main className='centered-page'>
        <div className='w-20 h-20 spinner' />
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className='relative flex flex-col py-3 w-full max-w-5xl mx-auto gap-3'>
        <TopFold />
        <Bio component='section' className='sm:hidden px-3' />
        <section>
          <Highlights />
        </section>
        <section className='sm:hidden'>
          <Counts className='flex' />
        </section>
        {isMobile && (
          <Suspense>
            <Tablist selectedTab={selectedTab} />
          </Suspense>
        )}
        <section
          aria-hidden={selectedTab !== 'grid'}
          aria-labelledby={`tab-${portfolioGridID}`}
          id={portfolioGridID}
          role='tabpanel'
          suppressHydrationWarning
        >
          <PortfolioGrid />
        </section>
        <section
          aria-hidden={selectedTab !== 'list'}
          aria-labelledby={`tab-${portfolioListID}`}
          id={portfolioListID}
          role='tabpanel'
          suppressHydrationWarning
        >
          <PortfolioList />
        </section>
      </main>
    </>
  );
}
