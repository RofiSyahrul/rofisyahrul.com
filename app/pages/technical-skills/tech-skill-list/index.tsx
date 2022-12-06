import { useLoaderData } from '@remix-run/react';
import clsx from 'clsx';

import VisuallyHidden from '~/components/visually-hidden';
import ExternalLinkIcon from '~/icons/external-link';
import type { TechSkillFields } from '~/types/response';

export default function TechSkillList() {
  const data = useLoaderData<TechSkillFields[]>();

  return (
    <ul className='flex flex-col w-full'>
      {data.map(item => (
        <li
          className={clsx(
            'w-full p-2 flex justify-between items-center border-b',
            'border-b-neutral-bright1 dark:border-b-neutral-dim1',
          )}
          key={item.name}
        >
          <span>{item.name}</span>
          {item.url && (
            <a
              className='btn btn-text btn-primary h-8'
              href={item.url}
              target='_blank'
              rel='noreferrer noopener'
              title={`Visit ${item.name}`}
            >
              <ExternalLinkIcon width={32} height={32} />
              <VisuallyHidden>{`Visit ${item.name}`}</VisuallyHidden>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
