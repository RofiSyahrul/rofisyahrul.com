import { Link } from '@remix-run/react';

import VisuallyHidden from '~/components/visually-hidden';
import { trackSeeHighlight } from '~/lib/analytics';
import type { HighlightName } from '~/types/highlights';

import { highlightMapping } from './config';

interface HighlightsProps {
  highlightNames: HighlightName[];
}

function createLinkClickHandler(name: HighlightName) {
  return () => {
    trackSeeHighlight(name);
  };
}

export default function Highlights({
  highlightNames,
}: HighlightsProps) {
  return (
    <ul className='flex w-full gap-3 flex-nowrap overflow-x-auto py-2 px-3 sm:py-0'>
      {highlightNames.map(name => {
        const { iconPath, label, url } = highlightMapping[name];

        return (
          <li
            key={name}
            className='flex flex-col gap-2 items-center justify-center'
          >
            <div className='w-20 h-20 rounded-full p-0.5 border-2 border-solid border-secondary-dim dark:border-secondary-bright'>
              <Link
                className='w-full h-full rounded-full flex justify-center items-center bg-primary-dim dark:bg-primary-bright hover:[filter:brightness(0.8)]'
                to={url}
                title={label}
                onClick={createLinkClickHandler(name)}
              >
                {iconPath}
                <VisuallyHidden>{label}</VisuallyHidden>
              </Link>
            </div>
            <small className='font-semibold text-primary-dim dark:text-primary-bright'>
              {label}
            </small>
          </li>
        );
      })}
    </ul>
  );
}
