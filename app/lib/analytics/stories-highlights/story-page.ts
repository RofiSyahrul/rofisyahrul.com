import type { StoriesEventData } from './_base';
import { trackStoriesEvent } from './_base';

export function trackPauseStoryClick(eventData: StoriesEventData) {
  trackStoriesEvent('pause', eventData);
}

export function trackPlayStoryClick(eventData: StoriesEventData) {
  trackStoriesEvent('play', eventData);
}

export function trackURLClickInStory(
  eventData: StoriesEventData & { targetURL: string },
) {
  trackStoriesEvent('click-url', eventData);
}

export function trackStoryFinished(eventData: StoriesEventData) {
  trackStoriesEvent('finished', eventData);
}
