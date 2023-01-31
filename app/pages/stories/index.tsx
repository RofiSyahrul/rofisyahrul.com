import { Outlet, useLoaderData, useNavigate } from '@remix-run/react';
import clsx from 'clsx';

import VisuallyHidden from '~/components/visually-hidden';
import { useBack } from '~/hooks/use-back';
import CloseIcon from '~/icons/close';
import { useInitStoriesStore } from '~/store/stories';
import type { StoriesData } from '~/types/stories';

import AudioToggleButton from './components/audio-toggle-button';
import InvisibleNavButtonss from './components/invisible-nav-buttons';
import Progress from './components/progress';
import Title from './components/title';

export default function StoriesPage() {
  const data = useLoaderData<StoriesData>();
  const back = useBack();

  const navigate = useNavigate();

  useInitStoriesStore({
    initialActiveIndex: data.initialActiveIndex,
    stories: data.stories,
    onNext(newActiveStory) {
      navigate(
        { pathname: `/stories/${newActiveStory.slug}` },
        { replace: true },
      );
    },
    onPrev(newActiveStory) {
      navigate(
        { pathname: `/stories/${newActiveStory.slug}` },
        { replace: true },
      );
    },
  });

  return (
    <div className='w-full bg-neutral-dim1 relative'>
      <div
        className='absolute top-0 right-0 bottom-0 left-0'
        onClick={back}
      />
      <div
        className={clsx(
          'h-screen w-full max-w-xl mx-auto',
          'bg-neutral-dim relative shadow-lg',
          'text-neutral-bright',
        )}
      >
        <header className='absolute top-2 left-0 w-full z-10'>
          <div className='flex gap-0.5 mb-2'>
            {data.stories.map(story => (
              <div
                key={story.slug}
                className={clsx(
                  'flex-grow h-0.5 relative',
                  'child:h-0.5 child:rounded-sm child:top-0 child:w-full',
                )}
              >
                <div className='flex flex-col items-stretch bg-neutral-bright2 relative align-baseline' />
                <Progress slug={story.slug} />
              </div>
            ))}
          </div>
          <div className='flex w-full flex-nowrap items-center justify-between px-2'>
            <Title />
            <div className='flex gap-2 items-center'>
              <AudioToggleButton />
              <button
                className='btn btn-text text-inherit'
                onClick={back}
                title='Close'
              >
                <CloseIcon
                  aria-label='Close'
                  width={20}
                  height={20}
                />
                <VisuallyHidden>Close</VisuallyHidden>
              </button>
            </div>
          </div>
        </header>
        <main
          className={clsx(
            'h-full w-full flex flex-col relative',
            'items-center justify-center gap-2 py-12 px-4',
          )}
        >
          <Outlet />
          <InvisibleNavButtonss />
        </main>
      </div>
    </div>
  );
}
