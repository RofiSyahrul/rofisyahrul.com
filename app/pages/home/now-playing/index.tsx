import type { MouseEventHandler } from 'react';
import { useCallback } from 'react';

import { useLoaderData, useRevalidator } from '@remix-run/react';
import clsx from 'clsx';

import LazyImage from '~/components/lazy-image';
import VisuallyHidden from '~/components/visually-hidden';
import RefreshIcon from '~/icons/refresh';
import SpotifyIcon from '~/icons/spotify';

import type { HomeData } from '../types';

function RefreshButton() {
  const { revalidate } = useRevalidator();

  const handleClick = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(
    e => {
      e.stopPropagation();
      revalidate();
    },
    [revalidate],
  );

  return (
    <button
      className='btn btn-text btn-secondary h-8 z-[1]'
      onClick={handleClick}
      title='Refresh'
    >
      <RefreshIcon />
      <VisuallyHidden>Refresh</VisuallyHidden>
    </button>
  );
}

function NowPlayingDetail() {
  const { spotifyNowPlaying } = useLoaderData<HomeData>();

  if (!spotifyNowPlaying) {
    return <em>No activity</em>;
  }

  return (
    <div className='flex gap-2 lg:gap-3 items-center text-base'>
      {spotifyNowPlaying.image && (
        <LazyImage
          alt={spotifyNowPlaying.title}
          src={spotifyNowPlaying.image.url}
          height='80px'
          width='80px'
          className='object-contain rounded'
        />
      )}
      <div className='flex flex-col gap-1'>
        <a
          href={spotifyNowPlaying.trackURL}
          target='_blank'
          rel='noreferrer noopener'
          title='Play in Spotify'
          className={clsx(
            'after:absolute after:top-0 after:left-0',
            'after:bottom-0 after:right-0 font-semibold',
            'text-secondary-dim dark:text-secondary-bright',
            'text-lg',
          )}
        >
          {spotifyNowPlaying.title}
        </a>
        <strong>{spotifyNowPlaying.artists.join(', ')}</strong>
      </div>
    </div>
  );
}

export default function NowPlaying() {
  return (
    <section
      className={clsx(
        'flex flex-col gap-2 rounded-lg',
        'bg-neutral-bright0 dark:bg-neutral-dim0',
        'shadow-lg dark:shadow-sm dark:shadow-neutral-dim2',
        'relative lg:fixed lg:bottom-2 lg:right-2',
        'p-2 lg:p-3 mx-auto max-w-[calc(100%-32px)] min-w-[250px] lg:max-w-xs',
      )}
    >
      <div className='flex gap-1 items-center'>
        <SpotifyIcon className='text-secondary-bright' />
        <h3 className='font-bold text-xl flex-1'>Now Playing</h3>
        <RefreshButton />
      </div>
      <NowPlayingDetail />
    </section>
  );
}
