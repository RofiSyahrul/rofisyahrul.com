import { useEffect } from 'react';

import { useOutletContext } from '@remix-run/react';

import Header from '~/components/header';

import Bio from './bio';
import Counts from './counts';
import Highlights from './highlights';
import PortfolioGrid from './portfolios/grid';
import Tablist from './tablist';
import TopFold from './top-fold';

export default function HomePage() {
  const outleteContext = useOutletContext();
  const isOutleteContextAvailable = !!outleteContext;

  useEffect(() => {
    if (!isOutleteContextAvailable) window.location.reload();
  }, [isOutleteContextAvailable]);

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
        <Tablist />
        <section id='portfolios'>
          <PortfolioGrid />
        </section>
      </main>
    </>
  );
}
