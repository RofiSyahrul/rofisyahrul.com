import { useEffect } from 'react';

import clsx from 'clsx';
import nProgress from 'nprogress';

interface LoadingProps {
  size?: number;
  variant?: 'whole-page' | 'with-backdrop';
}

export default function Loading({
  size = 192,
  variant,
}: LoadingProps) {
  const withBackdrop = variant === 'with-backdrop';

  useEffect(() => {
    nProgress.start();
    return () => {
      nProgress.done();
    };
  }, []);

  return (
    <div
      aria-busy
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuetext='Loading...'
      className={clsx(
        'flex items-center justify-center cursor-wait',
        variant && 'w-screen h-screen',
        withBackdrop &&
          clsx(
            'fixed z-30 top-0 right-0 bottom-0 left-0',
            'before:absolute before:bg-neutral-dim2 before:opacity-90',
            'before:w-full before:h-full before:top-0 before:right-0',
            'before:bottom-0 before:left-0',
          ),
      )}
      role='progressbar'
    >
      {!withBackdrop && (
        <img
          alt='Loading..'
          className='animate-globe'
          height={size}
          src='/icons/android-chrome-192x192.png'
          width={size}
        />
      )}
    </div>
  );
}
