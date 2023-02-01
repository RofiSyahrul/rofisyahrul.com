export const HIGHLIGHT_BLOG = 'blog' as const;
export const HIGHLIGHT_EXPERIENCES = 'experiences' as const;
export const HIGHLIGHT_PORTFOLIOS = 'portfolios' as const;
export const HIGHLIGHT_TOP_TRACKS = 'top-tracks' as const;

export const HIGHLIGHT_NAMES = [
  HIGHLIGHT_BLOG,
  HIGHLIGHT_EXPERIENCES,
  HIGHLIGHT_PORTFOLIOS,
  HIGHLIGHT_TOP_TRACKS,
] as const;

export type HighlightName = typeof HIGHLIGHT_NAMES[number];
