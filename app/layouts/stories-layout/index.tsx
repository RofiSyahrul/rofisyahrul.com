import { useCallback } from 'react';

import { useNavigate } from '@remix-run/react';
import clsx from 'clsx';

import { useBack } from '~/hooks/use-back';
import { useInitStoriesStore } from '~/store/stories';
import type { GenericStoryItem } from '~/types/stories';

import AudioToggleButton from './components/audio-toggle-button';
import CloseButton from './components/close-button';
import InvisibleNavButtons from './components/invisible-nav-buttons';
import Progress from './components/progress';
import Title from './components/title';
import type { StoriesLayoutProps } from './types';

export default function StoriesLayout({
  buildStoryPathname,
  children,
  initialActiveIndex,
  name,
  onClose,
  stories,
}: StoriesLayoutProps) {
  const back = useBack();
  const navigate = useNavigate();

  const handleNextAndPrev = useCallback(
    (newActiveStory: GenericStoryItem) => {
      const pathname = buildStoryPathname(newActiveStory.slug);
      navigate({ pathname }, { replace: true });
    },
    [buildStoryPathname, navigate],
  );

  useInitStoriesStore({
    initialActiveIndex,
    stories,
    onClose,
    onNext: handleNextAndPrev,
    onPrev: handleNextAndPrev,
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
            {stories.map(story => (
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
              <AudioToggleButton name={name} />
              <CloseButton name={name} />
            </div>
          </div>
        </header>
        <main
          className={clsx(
            'h-full w-full flex flex-col relative',
            'items-center justify-center gap-2 py-12 px-4',
          )}
        >
          {children}
          <InvisibleNavButtons name={name} />
        </main>
      </div>
    </div>
  );
}
