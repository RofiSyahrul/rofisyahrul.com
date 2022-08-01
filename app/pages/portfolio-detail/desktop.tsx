import { lazy, Suspense } from 'react';

import { useLoaderData } from '@remix-run/react';
import clsx from 'clsx';

import Carousel from '~/components/carousel';
import Popup from '~/components/popup';
import RichText from '~/components/rich-text';
import { useBack } from '~/hooks/use-back';
import type { PortfolioDetail } from '~/repositories/portfolio/types';

import InitialDate from './initial-date';

const Avatar = lazy(() => import('./avatar'));
const Links = lazy(() => import('./links'));
const TechStacks = lazy(() => import('./tech-stacks'));

export default function DesktopPortfolioDetailPopup() {
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

  const back = useBack();

  return (
    <Popup
      className='flex-wrap sm:flex-nowrap sm:overflow-hidden sm:h-[600px]'
      isOpen
      isCloseButtonShown
      isForceRender
      onClose={back}
    >
      <div
        className={clsx(
          'flex flex-grow flex-shrink flex-basis-[100%] min-w-[400px]',
          'items-center justify-center sm:flex-basis-[400px] sm:h-full',
          'relative',
        )}
      >
        <Carousel mediaList={mediaList} />
      </div>
      <div
        className={clsx(
          'relative flex-grow h-full overflow-y-auto sm:w-full',
          'scrollbar-thin scrollbar-thumb-neutral-dim2 scrollbar-track-neutral-bright1',
          'dark:scrollbar-thumb-neutral-bright2 scrollbar-track-neutral-dim1',
          'flex flex-col',
        )}
        style={{ flexShrink: 2 }}
      >
        <header
          className={clsx(
            'flex items-center gap-2 sticky top-0 left-0 p-2 w-full rounded-tr-lg',
            'bg-neutral-bright dark:bg-neutral-dim',
            'shadow dark:shadow-neutral-dim2',
          )}
        >
          {icon.url && (
            <Suspense>
              <Avatar className='h-16 sm:h-full block sm:hidden md:block' />
            </Suspense>
          )}
          <div className='flex-1'>
            <h3>{title}</h3>
            <div
              className={clsx(
                'mt-2 flex gap-2',
                'justify-between items-end',
              )}
            >
              <Suspense>{(repository || url) && <Links />}</Suspense>
              <InitialDate />
            </div>
          </div>
        </header>
        <RichText
          className='px-2 py-1'
          component='article'
          text={description}
        />
        {techStacks.length > 0 && (
          <footer
            className={clsx(
              'flex flex-col gap-2 p-2 w-full shadow',
              'sticky bottom-0 left-0 rounded-lg',
              'bg-neutral-bright dark:bg-neutral-dim',
            )}
          >
            <Suspense>
              <TechStacks />
            </Suspense>
          </footer>
        )}
      </div>
    </Popup>
  );
}
