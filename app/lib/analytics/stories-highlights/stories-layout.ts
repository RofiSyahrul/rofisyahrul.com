import type { HighlightsEventData, StoriesEventData } from './_base';
import { trackHighlightsEvent } from './_base';
import { trackStoriesEvent } from './_base';

// STORIES

export function trackCloseStories(eventData: StoriesEventData) {
  trackStoriesEvent('close', eventData);
}

export function trackMuteStoriesSound(eventData: StoriesEventData) {
  trackStoriesEvent('mute-sound', eventData);
}

export function trackActivateStoriesSound(
  eventData: StoriesEventData,
) {
  trackStoriesEvent('activate-sound', eventData);
}

export function trackNextStoryClick(eventData: StoriesEventData) {
  trackStoriesEvent('click-next', eventData);
}

export function trackPrevStoryClick(eventData: StoriesEventData) {
  trackStoriesEvent('click-prev', eventData);
}

// HIGHLIGHTS

export function trackCloseHighlights(eventData: HighlightsEventData) {
  trackHighlightsEvent('close', eventData);
}

export function trackMuteHighlightsSound(
  eventData: HighlightsEventData,
) {
  trackHighlightsEvent('mute-sound', eventData);
}

export function trackActivateHighlightsSound(
  eventData: HighlightsEventData,
) {
  trackHighlightsEvent('activate-sound', eventData);
}

export function trackNextHighlightClick(
  eventData: HighlightsEventData,
) {
  trackHighlightsEvent('click-next', eventData);
}

export function trackPrevHighlightClick(
  eventData: HighlightsEventData,
) {
  trackHighlightsEvent('click-prev', eventData);
}
