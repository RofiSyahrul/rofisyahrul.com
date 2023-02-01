import type { HighlightsEventData } from './_base';
import { trackHighlightsEvent } from './_base';

export function trackPauseHighlightClick(
  eventData: HighlightsEventData,
) {
  trackHighlightsEvent('pause', eventData);
}

export function trackPlayHighlightClick(
  eventData: HighlightsEventData,
) {
  trackHighlightsEvent('play', eventData);
}

export function trackURLClickInHighlight(
  eventData: HighlightsEventData & { targetURL: string },
) {
  trackHighlightsEvent('click-url', eventData);
}

export function trackHighlightFinished(
  eventData: HighlightsEventData,
) {
  trackHighlightsEvent('finished', eventData);
}
