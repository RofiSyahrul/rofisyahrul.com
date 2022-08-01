import { useOutletContext } from '@remix-run/react';
import clsx from 'clsx';

import VisuallyHidden from '~/components/visually-hidden';
import VerifiedIcon from '~/icons/verified';

import Bio from '../bio';
import Counts from '../counts';
import type { HomeData } from '../types';
import { socials } from './config';

const imageSize = 176;

export default function TopFold() {
  const { profile } = useOutletContext<HomeData>();

  return (
    <section className='flex gap-4 w-full px-3 items-center sm:items-start'>
      <img
        alt={profile.fullName}
        className={clsx(
          'w-20 h-20 rounded-full sm:w-32 sm:h-32 md:w-44 md:h-44 object-contain',
          'border border-solid border-neutral-bright1 dark:border-neutral-dim1',
        )}
        src={profile.photoPublicID}
        height={imageSize}
        loading='eager'
        width={imageSize}
      />
      <div className='flex flex-col gap-2 w-auto sm:flex-wrap sm:flex-row sm:items-center'>
        <div className='flex gap-1 items-center'>
          <h2 className='font-bold text-2xl sm:text-3xl'>
            {profile.fullName}
          </h2>
          <VerifiedIcon className='text-primary-dim dark:text-primary-bright' />
        </div>
        <ul className='social-links-list'>
          {socials.map(social => (
            <li key={social.name}>
              <a
                className='btn btn-solid btn-primary h-8'
                href={social.url}
                target='_blank'
                rel='noreferrer noopener'
                title={social.name}
              >
                {social.iconPath}
                <VisuallyHidden>{social.name}</VisuallyHidden>
              </a>
            </li>
          ))}
        </ul>
        <Counts className='hidden sm:flex mb-3 gap-10' />
        <Bio className='hidden sm:block' />
      </div>
    </section>
  );
}
