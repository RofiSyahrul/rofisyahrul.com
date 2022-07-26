import clsx from 'clsx';
import { useLoaderData } from 'remix';

import VisuallyHidden from '~/components/visually-hidden';

import Bio from '../bio';
import Counts from '../counts';
import type { HomeData } from '../types';
import { socials } from './config';
import VerifiedIcon from './icons/verified';

export default function TopFold() {
  const { profile } = useLoaderData<HomeData>();

  return (
    <section className='flex gap-4 w-full px-3 items-center sm:items-start'>
      <img
        alt='Syahrul Rofi'
        src={`https://res.cloudinary.com/rofi/image/upload/c_fill,g_faces,h_176,w_176/v1640233522/${profile.photoPublicID}.png`}
        width={176}
        height={176}
        loading='eager'
        className={clsx(
          'w-20 h-20 rounded-full sm:w-32 sm:h-32 md:w-44 md:h-44 object-contain',
          'border border-solid border-neutral-bright1 dark:border-neutral-dim1',
        )}
      />
      <div className='flex flex-col gap-2 w-auto sm:flex-wrap sm:flex-row sm:items-center'>
        <div className='flex gap-1 items-center'>
          <h2 className='font-bold text-2xl sm:text-3xl'>
            {profile.fullName}
          </h2>
          <VerifiedIcon />
        </div>
        <ul className='social-links-list'>
          {socials.map(social => (
            <li key={social.name}>
              <a
                className='w-8 h-8 rounded bg-primary-dim dark:bg-primary-bright flex justify-center items-center hover:[filter:brightness(0.8)]'
                href={social.url}
                target='_blank'
                rel='noreferrer noopener'
                title={social.name}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='20'
                  height='20'
                  className='text-primary-bright dark:text-primary-dim'
                >
                  {social.iconPath}
                </svg>
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
