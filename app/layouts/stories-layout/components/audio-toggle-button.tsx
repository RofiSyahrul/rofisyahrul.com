import { useCallback } from 'react';

import VisuallyHidden from '~/components/visually-hidden';
import SoundOffIcon from '~/icons/sound-off';
import SoundOnIcon from '~/icons/sound-on';
import {
  trackActivateHighlightsSound,
  trackActivateStoriesSound,
  trackMuteHighlightsSound,
  trackMuteStoriesSound,
} from '~/lib/analytics';
import {
  useStoryIsMuted,
  toggleStoryAudio,
  useActiveStory,
} from '~/store/stories';

import type { StoriesLayoutProps } from '../types';

export default function AudioToggleButton({
  name,
}: Pick<StoriesLayoutProps, 'name'>) {
  const isMuted = useStoryIsMuted();
  const {
    activeIndex,
    activeStory: { title },
  } = useActiveStory();

  const handleClick = useCallback(() => {
    const audioState = toggleStoryAudio();

    if (audioState === 'on') {
      if (name === 'stories') {
        trackActivateStoriesSound({
          storyIndex: activeIndex,
          storyTitle: title,
        });
        return;
      }

      trackActivateHighlightsSound({
        highlightIndex: activeIndex,
        highlightName: name,
        highlightTitle: title,
      });
      return;
    }

    if (name === 'stories') {
      trackMuteStoriesSound({
        storyIndex: activeIndex,
        storyTitle: title,
      });
      return;
    }

    trackMuteHighlightsSound({
      highlightIndex: activeIndex,
      highlightName: name,
      highlightTitle: title,
    });
  }, [activeIndex, name, title]);

  return (
    <button
      className='btn btn-text text-inherit'
      onClick={handleClick}
      title='Toggle audio'
    >
      {isMuted ? (
        <SoundOffIcon
          aria-label='Audio is muted'
          width={16}
          height={16}
        />
      ) : (
        <SoundOnIcon
          aria-label='Audio is playing'
          width={16}
          height={16}
        />
      )}
      <VisuallyHidden>Toggle audio</VisuallyHidden>
    </button>
  );
}
