import type { ReactNode } from 'react';

import { Link, useLoaderData } from '@remix-run/react';
import clsx from 'clsx';

import VisuallyHidden from '~/components/visually-hidden';
import type { HomeData } from '~/pages/home/types';

const imageSize = 176;

interface WrapperProps {
  children: ReactNode;
  className: string;
  hasStories: boolean;
}

function Wrapper({ children, className, hasStories }: WrapperProps) {
  if (!hasStories) {
    return (
      <div className={clsx('border-transparent', className)}>
        {children}
      </div>
    );
  }

  return (
    <Link
      to={{ pathname: '/stories' }}
      className={clsx(
        'rounded-full border-solid',
        'border-secondary-dim dark:border-secondary-bright',
        className,
      )}
      title='See my stories'
    >
      {children}
      <VisuallyHidden>See my stories</VisuallyHidden>
    </Link>
  );
}

export default function Avatar() {
  const { hasRecentlyPlayedTracks, profile, spotifyNowPlaying } =
    useLoaderData<HomeData>();

  return (
    <Wrapper
      className='w-20 h-20 rounded-full sm:w-32 sm:h-32 md:w-44 md:h-44 border-2'
      hasStories={
        hasRecentlyPlayedTracks || !!spotifyNowPlaying?.previewURL
      }
    >
      <img
        alt={profile.fullName}
        className={clsx(
          'w-full h-full object-contain rounded-full border border-solid',
          'border-neutral-bright1 dark:border-neutral-dim1',
        )}
        src={profile.photoPublicID}
        height={imageSize}
        loading='eager'
        width={imageSize}
      />
    </Wrapper>
  );
}
