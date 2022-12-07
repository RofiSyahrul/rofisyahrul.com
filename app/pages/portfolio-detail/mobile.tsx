import { lazy, Suspense } from 'react';

import { useLoaderData } from '@remix-run/react';
import clsx from 'clsx';

import Carousel from '~/components/carousel';
import HeaderNav from '~/components/header-nav';
import RichText from '~/components/rich-text';
import type { PortfolioDetail } from '~/repositories/portfolio/types';

import InitialDate from './initial-date';

const Avatar = lazy(() => import('./avatar'));
const Links = lazy(() => import('./links'));
const TechStacks = lazy(() => import('./tech-stacks'));

export default function MobilePortfolioDetailPage() {
  const data = useLoaderData<PortfolioDetail>();
  const {
    description,
    icon,
    mediaList,
    repository,
    techStacks,
    title,
    url,
  } = data;

  return (
    <div className='min-h-full'>
      <HeaderNav className='h-fit min-h-[3rem]' title={title} />
      <main className='relative flex flex-col gap-3 pt-3 pb-14 w-full max-w-5xl mx-auto'>
        <Carousel mediaList={mediaList} />
        <div className='flex px-2'>
          <InitialDate />
        </div>
        <article className='px-2'>
          {icon.url && (
            <Suspense>
              <Avatar className='h-16 float-left mr-2' />
            </Suspense>
          )}
          <RichText className='-mt-2' text={description} />
        </article>
        {techStacks.length > 0 && (
          <section className='flex flex-col px-2 pb-3 gap-2 w-full'>
            <TechStacks />
          </section>
        )}
      </main>
      {(repository || url) && (
        <Suspense>
          <Links
            className={clsx(
              'fixed w-full bottom-0 px-2 py-3',
              'bg-neutral-bright dark:bg-neutral-dim',
              'dark:shadow-neutral-dim2 shadow-inner',
            )}
            component='footer'
            withText
          />
        </Suspense>
      )}
    </div>
  );
}
