import type { HighlightName } from '~/types/highlights';

import { trackHighlightsEvent, trackStoriesEvent } from './_base';

export function trackSeeMyStories() {
  trackStoriesEvent('see-my-stories');
}

export function trackSeeHighlight(name: HighlightName) {
  trackHighlightsEvent('see-highlight', { name });
}
