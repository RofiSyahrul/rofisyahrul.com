import { useLoaderData } from '@remix-run/react';
import clsx from 'clsx';

import type { HomeData } from '../types';

interface BioProps {
  className?: string;
  component?: keyof JSX.IntrinsicElements;
}

export default function Bio({
  component: Component = 'div',
  className,
}: BioProps) {
  const { profile } = useLoaderData<HomeData>();

  return (
    <Component className={clsx('w-full', className)}>
      <h3 className='font-semibold text-base'>{profile.shortName}</h3>
      <p className='text-neutral-dim2 dark:text-neutral-bright2'>
        {profile.jobRole}
      </p>
      <p>{profile.description}</p>
    </Component>
  );
}
