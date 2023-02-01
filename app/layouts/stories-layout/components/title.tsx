import { useMemo } from 'react';

import dayjs from 'dayjs';

import { ONE_HOUR_IN_MINUTES } from '~/constants/times';
import SpotifyIcon from '~/icons/spotify';
import { useActiveStory } from '~/store/stories';

function getTimeDiff(timestamp: string): string {
  const now = dayjs();

  const diffInMinutes = now.diff(timestamp, 'minutes');
  if (diffInMinutes < 0) return 'Just now';

  if (diffInMinutes === 0) {
    return `${now.diff(timestamp, 'second')}s`;
  }

  const diffInHours = Math.floor(diffInMinutes / ONE_HOUR_IN_MINUTES);
  const minutesRem =
    diffInMinutes - ONE_HOUR_IN_MINUTES * diffInHours;

  if (diffInHours === 0) return `${minutesRem}m`;
  if (minutesRem === 0) return `${diffInHours}h`;
  return `${diffInHours}h ${minutesRem}m`;
}

export default function Title() {
  const { activeStory } = useActiveStory();

  const timeDiffNode = useMemo(() => {
    if (!activeStory.timestamp) return null;
    return (
      <span className='text-base text-neutral-bright2'>
        {getTimeDiff(activeStory.timestamp)}
      </span>
    );
  }, [activeStory.timestamp]);

  return (
    <div className='flex gap-2 items-center'>
      {activeStory.slug.startsWith('spotify-') && (
        <SpotifyIcon className='text-secondary-bright' />
      )}
      <h1 className='text-base font-semibold text-neutral-bright dark:text-neutral-bright'>
        {activeStory.title}
      </h1>
      {timeDiffNode}
    </div>
  );
}
