import { useCallback } from 'react';

import VisuallyHidden from '~/components/visually-hidden';
import {
  trackNextHighlightClick,
  trackNextStoryClick,
  trackPrevHighlightClick,
  trackPrevStoryClick,
} from '~/lib/analytics';
import {
  useActiveStory,
  goToPrevStory,
  goToNextStory,
} from '~/store/stories';

import type { StoriesLayoutProps } from '../types';

export default function InvisibleNavButtons({
  name,
}: Pick<StoriesLayoutProps, 'name'>) {
  const {
    activeIndex,
    activeStory: { title },
    canNext,
    canPrev,
  } = useActiveStory();

  const handlePrev = useCallback(() => {
    goToPrevStory();

    if (name === 'stories') {
      trackPrevStoryClick({
        storyIndex: activeIndex,
        storyTitle: title,
      });
      return;
    }

    trackPrevHighlightClick({
      highlightIndex: activeIndex,
      highlightName: name,
      highlightTitle: title,
    });
  }, [activeIndex, name, title]);

  const handleNext = useCallback(() => {
    goToNextStory();

    if (name === 'stories') {
      trackNextStoryClick({
        storyIndex: activeIndex,
        storyTitle: title,
      });
      return;
    }

    trackNextHighlightClick({
      highlightIndex: activeIndex,
      highlightName: name,
      highlightTitle: title,
    });
  }, [activeIndex, name, title]);

  return (
    <>
      <button
        disabled={!canPrev}
        onClick={handlePrev}
        className='btn btn-text w-1/3 h-full absolute top-0 left-0'
        title='Prev'
      >
        <VisuallyHidden>Previous story</VisuallyHidden>
      </button>
      <button
        disabled={!canNext}
        onClick={handleNext}
        className='btn btn-text w-1/3 h-full absolute top-0 right-0'
        title='Next'
      >
        <VisuallyHidden>Next story</VisuallyHidden>
      </button>
    </>
  );
}
