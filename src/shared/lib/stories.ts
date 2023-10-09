const storyNames = ['recent', 'top-tracks'] as const;

export type StoryName = (typeof storyNames)[number];

export const storiesConfigMapping: Record<
  StoryName,
  {
    cookieKey: string;
    /**
     * cookie max age in days
     */
    cookieMaxAge: number;
    pathPrefix: string;
  }
> = {
  recent: {
    cookieKey: '__l_o_r__',
    cookieMaxAge: 1,
    pathPrefix: '/stories/',
  },
  'top-tracks': {
    cookieKey: '__l_o_tt__',
    cookieMaxAge: 14,
    pathPrefix: '/highlights/top-tracks/',
  },
};
