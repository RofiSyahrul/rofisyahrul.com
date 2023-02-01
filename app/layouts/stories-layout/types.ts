import type { ReactNode } from 'react';

import type { UseInitStoriesStoreParams } from '~/store/stories';
import type { HighlightName } from '~/types/highlights';

export interface StoriesLayoutProps
  extends Pick<
    UseInitStoriesStoreParams,
    'initialActiveIndex' | 'onClose' | 'stories'
  > {
  buildStoryPathname(storySlug: string): string;
  children: ReactNode;
  name: 'stories' | HighlightName;
}
