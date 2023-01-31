import { Outlet, useLoaderData, useNavigate } from '@remix-run/react';
import clsx from 'clsx';
import dayjs from 'dayjs';

import VisuallyHidden from '~/components/visually-hidden';
import { useBack } from '~/hooks/use-back';
import CloseIcon from '~/icons/close';
import SoundOffIcon from '~/icons/sound-off';
import SoundOnIcon from '~/icons/sound-on';
import SpotifyIcon from '~/icons/spotify';
import {
  goToNextStory,
  goToPrevStory,
  toggleStoryAudio,
  useActiveStory,
  useInitStoriesStore,
  useStoryIsMuted,
  useStoryProgress,
} from '~/store/stories';
import type { StoriesData } from '~/types/stories';

interface ProgressProps {
  slug: string;
}

function StoryProgress({ slug }: ProgressProps) {
  const progress = useStoryProgress(slug);

  return (
    <div
      className='absolute top-0 transition-[width] will-change-[width] bg-neutral-bright'
      style={{
        width: `${Math.min(progress, 100)}%`,
        transitionTimingFunction: 'linear',
        transitionDuration: '10ms',
      }}
    />
  );
}

function getTimeDiff(timestamp: string) {
  const now = dayjs();
  const diffInHours = now.diff(timestamp, 'hours');
  if (diffInHours > 0) return `${diffInHours}h`;

  const diffInMinutes = now.diff(timestamp, 'minutes');
  if (diffInMinutes > 0) return `${diffInMinutes}m`;

  return `${now.diff(timestamp, 'second')}s`;
}

function ActiveStory() {
  const { activeStory } = useActiveStory();

  return (
    <div className='flex gap-2 items-center'>
      {activeStory.slug.startsWith('spotify-') && (
        <SpotifyIcon className='text-secondary-bright' />
      )}
      <h1 className='text-base font-semibold text-neutral-bright dark:text-neutral-bright'>
        {activeStory.title}
      </h1>
      {activeStory.timestamp && (
        <span className='text-base text-neutral-bright2'>
          {getTimeDiff(activeStory.timestamp)}
        </span>
      )}
    </div>
  );
}

function AudioToggleButton() {
  const isMuted = useStoryIsMuted();

  return (
    <button
      className='btn btn-text text-inherit'
      onClick={toggleStoryAudio}
      title='Toggle audio'
    >
      {isMuted ? (
        <SoundOffIcon
          aria-label='Audio is muted'
          width={16}
          height={16}
        />
      ) : (
        <SoundOnIcon
          aria-label='Audio is playing'
          width={16}
          height={16}
        />
      )}
      <VisuallyHidden>Toggle audio</VisuallyHidden>
    </button>
  );
}

function InvisibleNavButtonss() {
  const { canNext, canPrev } = useActiveStory();

  return (
    <>
      <button
        disabled={!canPrev}
        onClick={goToPrevStory}
        className='btn btn-text w-1/3 h-full absolute top-0 left-0'
        title='Prev'
      >
        <VisuallyHidden>Previous story</VisuallyHidden>
      </button>
      <button
        disabled={!canNext}
        onClick={goToNextStory}
        className='btn btn-text w-1/3 h-full absolute top-0 right-0'
        title='Next'
      >
        <VisuallyHidden>Next story</VisuallyHidden>
      </button>
    </>
  );
}

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
                <StoryProgress slug={story.slug} />
              </div>
            ))}
          </div>
          <div className='flex w-full flex-nowrap items-center justify-between px-2'>
            <ActiveStory />
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
