import { useEffect, useRef } from 'react';

import {
  useLocation,
  useNavigationType,
  useOutletContext,
} from '@remix-run/react';

import Header from '~/components/header';
import { useUserAgent } from '~/contexts/user-agent';

import Bio from './bio';
import Counts from './counts';
import PortfolioGrid from './portfolios/grid';
import PortfolioList from './portfolios/list';
import Tablist from './tablist';
import {
  portfolioGridID,
  portfolioListID,
  stateOfChangingTab,
} from './tablist/constants';
import type { TabName } from './tablist/types';
import TopFold from './top-fold';

export default function HomePage() {
  const headerRef = useRef<HTMLElement>(null);
  const portfolioGridRef = useRef<HTMLElement>(null);
  const portfolioListRef = useRef<HTMLElement>(null);

  const outleteContext = useOutletContext();
  const isOutleteContextAvailable = !!outleteContext;

  const { isMobile } = useUserAgent();
  const navigationType = useNavigationType();

  const { pathname, state } = useLocation();
  const selectedTab: TabName =
    pathname === '/portfolio-list' && isMobile ? 'list' : 'grid';

  useEffect(() => {
    if (!isOutleteContextAvailable) window.location.reload();
  }, [isOutleteContextAvailable]);

  useEffect(() => {
    if (state !== stateOfChangingTab || navigationType === 'POP') {
      return;
    }

    const tabPanel =
      selectedTab === 'grid'
        ? portfolioGridRef.current
        : portfolioListRef.current;

    if (!tabPanel) return;

    const tabPanelRect = tabPanel.getBoundingClientRect();
    window.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: tabPanelRect.top - (headerRef.current?.clientHeight ?? 0),
    });
  }, [navigationType, selectedTab, state]);

  if (!isOutleteContextAvailable) {
    return (
      <main className='centered-page'>
        <div className='w-20 h-20 spinner' />
      </main>
    );
  }

  return (
    <>
      <Header ref={headerRef} />
      <main className='relative flex flex-col py-3 w-full max-w-5xl mx-auto gap-3'>
        <TopFold />
        <Bio component='section' className='sm:hidden px-3' />
        <section className='sm:hidden'>
          <Counts className='flex' />
        </section>
        <Tablist selectedTab={selectedTab} />
        <section
          aria-hidden={selectedTab !== 'grid'}
          aria-labelledby={`tab-${portfolioGridID}`}
          className='portfolio-tab-panel'
          id={portfolioGridID}
          ref={portfolioGridRef}
          role='tabpanel'
          suppressHydrationWarning
        >
          <PortfolioGrid />
        </section>
        <section
          aria-hidden={selectedTab !== 'list'}
          aria-labelledby={`tab-${portfolioListID}`}
          className='portfolio-tab-panel'
          id={portfolioListID}
          ref={portfolioListRef}
          role='tabpanel'
          suppressHydrationWarning
        >
          <PortfolioList />
        </section>
      </main>
    </>
  );
}
