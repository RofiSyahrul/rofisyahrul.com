import { useEffect } from 'react';

import { useParams } from '@remix-run/react';
import clsx from 'clsx';

import LazyImage from '~/components/lazy-image';
import VisuallyHidden from '~/components/visually-hidden';
import { useAudio } from '~/hooks/use-audio';
import { useBack } from '~/hooks/use-back';
import {
  goToNextStory,
  handleTimeUpdate,
  setActiveStory,
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
  const { activeStory, canNext } = useActiveStory<
    NowPlayingStoryItem | RecentPlayedStoryItem
  >();

  const detail = activeStory.detail;

  const back = useBack();

  useEffect(() => {
    setActiveStory(slug);
  }, [slug]);

  const { audioRef, toggleAudioPlaying } = useAudio();

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
        onTimeUpdate={handleTimeUpdate}
        onEnded={canNext ? goToNextStory : back}
      >
        <source src={detail.previewURL} type='audio/mpeg' />
        <em className='text-xs'>
          Your browser does not support to play audio
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
