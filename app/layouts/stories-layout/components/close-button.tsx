import { useCallback } from 'react';

import VisuallyHidden from '~/components/visually-hidden';
import { useBack } from '~/hooks/use-back';
import CloseIcon from '~/icons/close';
import {
  trackCloseHighlights,
  trackCloseStories,
} from '~/lib/analytics';
import { useActiveStory } from '~/store/stories';

import type { StoriesLayoutProps } from '../types';

export default function CloseButton({
  name,
}: Pick<StoriesLayoutProps, 'name'>) {
  const back = useBack();

  const {
    activeIndex,
    activeStory: { title },
  } = useActiveStory();

  const handleClick = useCallback(() => {
    if (name === 'stories') {
      trackCloseStories({
        storyIndex: activeIndex,
        storyTitle: title,
      });
    } else {
      trackCloseHighlights({
        highlightIndex: activeIndex,
        highlightName: name,
        highlightTitle: title,
      });
    }

    back();
  }, [activeIndex, back, name, title]);

  return (
    <button
      className='btn btn-text text-inherit'
      onClick={handleClick}
      title='Close'
    >
      <CloseIcon aria-label='Close' width={20} height={20} />
      <VisuallyHidden>Close</VisuallyHidden>
    </button>
  );
}
