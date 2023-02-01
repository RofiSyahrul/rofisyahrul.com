import { useEffect, useMemo } from 'react';

import { useParams } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/server-runtime';
import clsx from 'clsx';

import LazyImage from '~/components/lazy-image';
import VisuallyHidden from '~/components/visually-hidden';
import { useAudio } from '~/hooks/use-audio';
import { useBack } from '~/hooks/use-back';
import { buildMeta } from '~/lib/meta';
import {
  goToNextStory,
  handleTimeUpdate,
  setActiveStory,
  useActiveStory,
  useStoryIsMuted,
} from '~/store/stories';
import type { TopTrackStoryItem } from '~/types/stories';

import type { TopTracksLoader } from '../top-tracks';

export const meta: MetaFunction<
  unknown,
  { 'routes/highlights/top-tracks': TopTracksLoader }
> = ({ params, parentsData }) => {
  const topTracksData = parentsData['routes/highlights/top-tracks'];
  if (!topTracksData) return buildMeta();

  const { slug } = params;

  const { title } =
    topTracksData.topTrackStories?.find(
      story => story.slug === slug,
    ) ?? {};

  if (!title) return buildMeta();
  return buildMeta({ title });
};

const MAX_IMAGE_SIZE = 300;

export default function TopTrackDetailPage() {
  const params = useParams<'slug'>();
  const slug = params.slug ?? '';

  useEffect(() => {
    setActiveStory(slug);
  }, [slug]);

  const back = useBack();
  const isMuted = useStoryIsMuted();
  const {
    activeStory: { detail },
    canNext,
  } = useActiveStory<TopTrackStoryItem>();

  const { artists, image, previewURL, rank, title, trackURL } =
    detail;

  const { audioRef, toggleAudioPlaying } = useAudio();

  const imageNode = useMemo(() => {
    if (!image?.url) return null;

    const size = `${MAX_IMAGE_SIZE - (rank - 1) * 10}px`;
    return (
      <LazyImage
        alt={title}
        src={image.url}
        height={size}
        width={size}
        className='object-contain rounded-lg'
      />
    );
  }, [image?.url, rank, title]);

  return (
    <>
      <div className='flex flex-nowrap items-center justify-between gap-2 mb-4'>
        <h2 className='flex-1 text-xl text-neutral-bright0 dark:text-neutral-bright0'>
          My top track in last 4 weeks
        </h2>
        <strong className='text-5xl text-secondary-bright dark:text-secondary-bright'>
          #{rank}
        </strong>
      </div>

      {imageNode}

      <a
        href={trackURL}
        target='_blank'
        rel='noreferrer noopener'
        title='Play in Spotify'
        className={clsx(
          'text-4xl text-center font-bold z-10',
          'text-secondary-bright dark:text-secondary-bright',
        )}
      >
        {title}
      </a>

      {artists.length > 0 && (
        <p className='text-lg'>{artists.join(', ')}</p>
      )}

      <audio
        autoPlay
        key={previewURL}
        ref={audioRef}
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={canNext ? goToNextStory : back}
      >
        <source src={previewURL} type='audio/mpeg' />
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
