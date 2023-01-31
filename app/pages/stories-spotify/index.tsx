import type { SyntheticEvent } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useCallback } from 'react';

import { useParams } from '@remix-run/react';
import clsx from 'clsx';

import LazyImage from '~/components/lazy-image';
import VisuallyHidden from '~/components/visually-hidden';
import { useBack } from '~/hooks/use-back';
import {
  goToNextStory,
  setActiveStory,
  setStoryProgress,
  useActiveStory,
  useStoryIsMuted,
} from '~/store/stories';
import type {
  NowPlayingStoryItem,
  RecentPlayedStoryItem,
} from '~/types/stories';

export default function StoriesSpotifyPage() {
  const params = useParams<'slug'>();
  const slug = params.slug ?? '';

  const isMuted = useStoryIsMuted();
  const activeStoryState = useActiveStory();
  const { canNext } = activeStoryState;
  const activeStory: NowPlayingStoryItem | RecentPlayedStoryItem =
    activeStoryState.activeStory as any;

  const activeSlug = activeStory.slug;

  const detail = activeStory.detail;

  const back = useBack();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setActiveStory(slug);
  }, [slug]);

  const handleAudioTimeUpdate = useCallback(
    (event: SyntheticEvent<HTMLAudioElement>) => {
      const { currentTime, duration } = event.currentTarget;
      setStoryProgress(activeSlug, (currentTime * 100) / duration);
    },
    [activeSlug],
  );

  const toggleAudioPlaying = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) audio.play();
    else audio.pause();
  }, []);

  useEffect(() => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
    }
  }, []);

  return (
    <>
      {detail.image && (
        <LazyImage
          alt={detail.title}
          src={detail.image.url}
          height='250px'
          width='250px'
          className='object-contain rounded'
        />
      )}
      <a
        href={detail.trackURL}
        target='_blank'
        className={clsx(
          'text-4xl text-center font-bold z-10',
          'text-secondary-bright dark:text-secondary-bright',
        )}
        rel='noreferrer noopener'
        title='Play in Spotify'
      >
        {detail.title}
      </a>
      {detail.artists.length > 0 && (
        <p className='text-lg'>{detail.artists.join(', ')}</p>
      )}
      <audio
        autoPlay
        key={detail.previewURL}
        ref={audioRef}
        muted={isMuted}
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={canNext ? goToNextStory : back}
      >
        <source src={detail.previewURL} type='audio/mpeg' />
        <em className='text-xs'>
          Your browser is not supported to play audio
        </em>
      </audio>
      <button
        className='absolute top-0 right-0 bottom-0 left-0 btn btn-text'
        onClick={toggleAudioPlaying}
        title='Play/Pause'
      >
        <VisuallyHidden>Play/Pause</VisuallyHidden>
      </button>
    </>
  );
}
