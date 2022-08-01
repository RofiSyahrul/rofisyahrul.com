import { useLoaderData } from '@remix-run/react';

import type { PortfolioDetail } from '~/repositories/portfolio/types';

export default function TechStacks() {
  const { techStacks } = useLoaderData<PortfolioDetail>();

  return (
    <>
      <h4 className='text-neutral-dim2 dark:text-neutral-bright2'>
        {`Tech Stack${techStacks.length > 1 ? 's' : ''}`}
      </h4>
      <ul className='list-none flex gap-2 flex-wrap w-full'>
        {techStacks.map(techStack => {
          const techStackNode = (
            <>
              {techStack.logo?.resourceType === 'image' && (
                <img
                  alt={techStack.logo.alt}
                  height={techStack.logo.height}
                  src={techStack.logo.url}
                  width={techStack.logo.width}
                />
              )}
              <span>{techStack.name}</span>
            </>
          );

          if (!techStack.url) {
            return (
              <li
                key={techStack.name}
                className='btn btn-text btn-primary h-6 gap-2'
                style={{ cursor: 'default' }}
                title={techStack.name}
              >
                {techStackNode}
              </li>
            );
          }

          return (
            <li key={techStack.name}>
              <a
                className='btn btn-text btn-primary h-6 gap-2'
                href={techStack.url ?? ''}
                target='_blank'
                rel='noreferrer noopener'
                title={techStack.name}
              >
                {techStackNode}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
