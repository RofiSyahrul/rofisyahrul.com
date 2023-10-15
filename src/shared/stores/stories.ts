import Cookies from 'js-cookie';
import type { EventHandler } from 'svelte/elements';
import { writable } from 'svelte/store';

import { isBrowser } from '@/shared/lib/client/env';
import {
  storiesConfigMapping,
  type StoryName,
} from '@/shared/lib/stories';
import type { GenericStoryItem } from '@/shared/types/stories';

import { requestIdleCallback } from '../lib/client/idle-callback';

interface ActiveStory<T extends GenericStoryItem = GenericStoryItem> {
  canNext: boolean;
  canPrev: boolean;
  index: number;
  story: T;
}

function throwError(): never {
  throw new Error('stories store has not been initialized');
}

export const storiesAction = writable({
  next(): void {
    throwError();
  },
  prev(): void {
    throwError();
  },
  toggleAudio(): 'on' | 'off' {
    throwError();
  },
});

let setActiveStoryProgress: (value: number) => void = throwError;

const DEFAULT_ACTIVE_STORY: ActiveStory = {
  canNext: false,
  canPrev: false,
  index: 0,
  story: {
    detail: {},
    slug: '',
    title: '',
  },
};

export const activeStory = writable(DEFAULT_ACTIVE_STORY);
export const storyProgress = writable<Record<string, number>>({});
export const isStoryMuted = writable(false);
export const isWaitingStory = writable(true);

export const handleTimeUpdate: EventHandler<
  Event,
  HTMLAudioElement | HTMLVideoElement
> = e => {
  const { currentTime, duration } = e.currentTarget;
  setActiveStoryProgress((currentTime * 100) / duration);
};

export interface InitStoriesStoreParams {
  initialActiveIndex: number;
  name: StoryName;
  stories: GenericStoryItem[];
}

function getInitialStoryProgress({
  initialActiveIndex,
  stories,
}: Pick<InitStoriesStoreParams, 'initialActiveIndex' | 'stories'>) {
  const initialStoryProgress: Record<string, number> = {};

  stories.forEach((story, index) => {
    initialStoryProgress[story.slug] =
      index < initialActiveIndex ? 100 : 0;
  });

  return initialStoryProgress;
}

export function initStoriesStore({
  initialActiveIndex,
  name,
  stories,
}: InitStoriesStoreParams) {
  const { cookieKey, cookieMaxAge, pathPrefix } =
    storiesConfigMapping[name];

  const totalStories = stories.length;

  function isNextAvailable(index: number) {
    return index < totalStories - 1;
  }

  function isPrevAvailable(index: number) {
    return index > 0;
  }

  function getActiveStory(index: number): ActiveStory {
    return {
      canNext: isNextAvailable(index),
      canPrev: isPrevAvailable(index),
      index,
      story: stories[index] ?? DEFAULT_ACTIVE_STORY.story,
    };
  }

  function navigateToNewStory(slug: string) {
    history.replaceState({}, '', pathPrefix + slug);
  }

  const initialActiveStory = getActiveStory(initialActiveIndex);
  const initialStoryProgress = getInitialStoryProgress({
    initialActiveIndex,
    stories,
  });

  let currentActiveStory = { ...initialActiveStory };
  let currentStoryProgress = { ...initialStoryProgress };
  let isStoryMutedState = false;

  const unsubscribeActiveStory = activeStory.subscribe(
    newActiveStory => {
      currentActiveStory = newActiveStory;
      if (isBrowser) {
        document.title = `${newActiveStory.story.title} | Syahrul Rofi`;
      }
    },
  );

  const unsubscribeStoryProgress = storyProgress.subscribe(
    newStoryProgress => {
      currentStoryProgress = newStoryProgress;
    },
  );

  const unsubscribeStoryMuted = isStoryMuted.subscribe(newState => {
    isStoryMutedState = newState;
  });

  activeStory.set(initialActiveStory);
  storyProgress.set(initialStoryProgress);
  isWaitingStory.set(false);

  function next() {
    const { index, story } = currentActiveStory;
    const newIndex = index + 1;
    if (newIndex >= totalStories) return;

    isWaitingStory.set(true);

    requestIdleCallback(() => {
      const prevSlug = story.slug;
      const newActiveStory = getActiveStory(newIndex);
      const newSlug = newActiveStory.story.slug;

      storyProgress.set({
        ...currentStoryProgress,
        [prevSlug]: 100,
        [newSlug]: 0,
      });

      activeStory.set(newActiveStory);
      navigateToNewStory(newSlug);
      isWaitingStory.set(false);
    });
  }

  function prev() {
    const { index, story } = currentActiveStory;
    const newIndex = index - 1;
    if (newIndex < 0) return;

    isWaitingStory.set(true);

    requestIdleCallback(() => {
      const prevSlug = story.slug;
      const newActiveStory = getActiveStory(newIndex);
      const newSlug = newActiveStory.story.slug;

      storyProgress.set({
        ...currentStoryProgress,
        [prevSlug]: 0,
        [newSlug]: 0,
      });

      activeStory.set(newActiveStory);
      navigateToNewStory(newSlug);
      isWaitingStory.set(false);
    });
  }

  function toggleAudio() {
    const isMuted = !isStoryMutedState;
    isStoryMuted.set(isMuted);
    return isMuted ? 'off' : 'on';
  }

  storiesAction.set({ next, prev, toggleAudio });

  setActiveStoryProgress = value => {
    storyProgress.set({
      ...currentStoryProgress,
      [currentActiveStory.story.slug]: value,
    });
  };

  function unsubscribeStores() {
    isWaitingStory.set(true);
    unsubscribeActiveStory();
    unsubscribeStoryProgress();
    unsubscribeStoryMuted();
  }

  function handleStoryClose() {
    if (currentActiveStory.canNext) {
      Cookies.set(cookieKey, currentActiveStory.story.slug, {
        expires: cookieMaxAge,
        path: '/',
        sameSite: 'Lax',
      });
    } else {
      Cookies.remove(cookieKey);
    }

    unsubscribeStores();
  }

  if (!isBrowser) return unsubscribeStores;

  window.addEventListener('beforeunload', handleStoryClose);
  window.addEventListener('popstate', handleStoryClose);

  return () => {
    activeStory.set(DEFAULT_ACTIVE_STORY);
    unsubscribeStores();
    window.removeEventListener('beforeunload', handleStoryClose);
    window.removeEventListener('popstate', handleStoryClose);
  };
}
