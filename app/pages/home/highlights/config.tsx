import SpotifyIcon from '~/icons/spotify';
import type { Item } from '~/types/general';
import type { HighlightName } from '~/types/highlights';

interface Highlight extends Item<HighlightName> {
  label: string;
}

export const highlightMapping: Record<HighlightName, Highlight> = {
  blog: {
    iconPath: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='70%'
        height='70%'
        className='text-primary-bright dark:text-primary-dim'
      >
        <path
          fill='currentColor'
          d='m19 1h-14a5.006 5.006 0 0 0 -5 5v12a5.006 5.006 0 0 0 5 5h14a5.006 5.006 0 0 0 5-5v-12a5.006 5.006 0 0 0 -5-5zm-14 2h14a3 3 0 0 1 3 3v1h-20v-1a3 3 0 0 1 3-3zm14 18h-14a3 3 0 0 1 -3-3v-9h20v9a3 3 0 0 1 -3 3zm0-8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 0-2h12a1 1 0 0 1 1 1zm-4 4a1 1 0 0 1 -1 1h-8a1 1 0 0 1 0-2h8a1 1 0 0 1 1 1zm-12-12a1 1 0 1 1 1 1 1 1 0 0 1 -1-1zm3 0a1 1 0 1 1 1 1 1 1 0 0 1 -1-1zm3 0a1 1 0 1 1 1 1 1 1 0 0 1 -1-1z'
        />
      </svg>
    ),
    label: 'Blog',
    name: 'blog',
    url: '/highlights/blog',
  },
  experiences: {
    iconPath: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='70%'
        height='70%'
        className='text-primary-bright dark:text-primary-dim'
      >
        <path
          fill='currentColor'
          d='M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm8.647,7H17.426a19.676,19.676,0,0,0-2.821-4.644A10.031,10.031,0,0,1,20.647,7ZM16.5,12a10.211,10.211,0,0,1-.476,3H7.976A10.211,10.211,0,0,1,7.5,12a10.211,10.211,0,0,1,.476-3h8.048A10.211,10.211,0,0,1,16.5,12ZM8.778,17h6.444A19.614,19.614,0,0,1,12,21.588,19.57,19.57,0,0,1,8.778,17Zm0-10A19.614,19.614,0,0,1,12,2.412,19.57,19.57,0,0,1,15.222,7ZM9.4,2.356A19.676,19.676,0,0,0,6.574,7H3.353A10.031,10.031,0,0,1,9.4,2.356ZM2.461,9H5.9a12.016,12.016,0,0,0-.4,3,12.016,12.016,0,0,0,.4,3H2.461a9.992,9.992,0,0,1,0-6Zm.892,8H6.574A19.676,19.676,0,0,0,9.4,21.644,10.031,10.031,0,0,1,3.353,17Zm11.252,4.644A19.676,19.676,0,0,0,17.426,17h3.221A10.031,10.031,0,0,1,14.605,21.644ZM21.539,15H18.1a12.016,12.016,0,0,0,.4-3,12.016,12.016,0,0,0-.4-3h3.437a9.992,9.992,0,0,1,0,6Z'
        />
      </svg>
    ),
    label: 'Portfolios',
    name: 'portfolios',
    url: '/highlights/portfolio',
  },
  portfolios: {
    iconPath: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        width='70%'
        height='70%'
        className='text-primary-bright dark:text-primary-dim'
      >
        <path
          fill='currentColor'
          d='M19,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H5A5.006,5.006,0,0,0,0,9V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V9A5.006,5.006,0,0,0,19,4ZM11,2h2a3,3,0,0,1,2.816,2H8.184A3,3,0,0,1,11,2ZM5,6H19a3,3,0,0,1,3,3v3H2V9A3,3,0,0,1,5,6ZM19,22H5a3,3,0,0,1-3-3V14h9v1a1,1,0,0,0,2,0V14h9v5A3,3,0,0,1,19,22Z'
        />
      </svg>
    ),
    label: 'Experiences',
    name: 'experiences',
    url: '/highlights/experiences',
  },
  'top-tracks': {
    iconPath: (
      <SpotifyIcon
        width='70%'
        height='70%'
        className='text-secondary-bright dark:text-secondary-dim'
      />
    ),
    label: 'Top Tracks',
    name: 'top-tracks',
    url: '/highlights/top-tracks',
  },
};
