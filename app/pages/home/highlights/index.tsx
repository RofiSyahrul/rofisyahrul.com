import { Link } from 'remix';

import VisuallyHidden from '~/components/visually-hidden';

import { highlights } from './config';

export default function Highlights() {
  return (
    <ul className='flex w-full gap-3 flex-nowrap overflow-x-auto py-2 px-3 sm:py-0'>
      {highlights.map(({ iconPath, label, name, url }) => (
        <li
          key={name}
          className='flex flex-col gap-2 items-center justify-center'
        >
          <div className='w-24 h-24 rounded-full p-0.5 border border-solid border-neutral-bright2 dark:border-neutral-dim2'>
            <Link
              className='w-full h-full rounded-full flex justify-center items-center bg-primary-dim dark:bg-primary-bright hover:[filter:brightness(0.8)]'
              to={url}
              title={label}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='36'
                height='36'
                className='text-primary-bright dark:text-primary-dim'
              >
                {iconPath}
              </svg>
              <VisuallyHidden>{label}</VisuallyHidden>
            </Link>
          </div>
          <h6 className='font-semibold text-primary-dim dark:text-primary-bright'>
            {label}
          </h6>
        </li>
      ))}
    </ul>
  );
}
