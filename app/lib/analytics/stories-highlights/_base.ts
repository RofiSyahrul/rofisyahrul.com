import type { HighlightName } from '~/types/highlights';

import { trackEvent } from '../_base';

const STORIES_PREFIX = 'stories/';
const HIGHLIGHT_PREFIX = 'highlights/';

export function trackStoriesEvent<TData extends Record<string, any>>(
  eventName: string,
  eventData?: TData,
) {
  trackEvent(`${STORIES_PREFIX}${eventName}`, eventData);
}

export function trackHighlightsEvent<
  TData extends Record<string, any>,
>(eventName: string, eventData?: TData) {
  trackEvent(`${HIGHLIGHT_PREFIX}${eventName}`, eventData);
}

export interface StoriesEventData {
  storyIndex: number;
  storyTitle: string;
}

export interface HighlightsEventData {
  highlightIndex: number;
  highlightName: HighlightName;
  highlightTitle: string;
}
