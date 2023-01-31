import { useEffect, useRef } from 'react';

import { useFetcher } from '@remix-run/react';
import { createStore, useStore } from 'zustand';

import type { GenericStoryItem } from '~/types/stories';

interface UseInitStoriesStoreParams {
  initialActiveIndex?: number;
  onNext?: (newActiveStory: GenericStoryItem) => void;
  onPrev?: (newActiveStory: GenericStoryItem) => void;
  stories: GenericStoryItem[];
}

interface StoriesStore {
  activeIndex: number;
  activeStory: GenericStoryItem;
  goToNextStory(): void;
  goToPrevStory(): void;
  isMuted: boolean;
  isNextStoryAvailable: boolean;
  isPrevStoryAvailable: boolean;
  progress: Record<string, number>;
  setActiveStory(slug: string): void;
  setProgress(slug: string, value: number): void;
  toggleAudio(): void;
}

function throwError(): never {
  throw new Error('stories store has not been initialized');
}

export let goToNextStory: StoriesStore['goToNextStory'] = throwError;
export let goToPrevStory: StoriesStore['goToPrevStory'] = throwError;
export let setActiveStory: StoriesStore['setActiveStory'] =
  throwError;

export let setStoryProgress: StoriesStore['setProgress'] = throwError;
export let toggleStoryAudio: StoriesStore['toggleAudio'] = throwError;

export let useActiveStory: () => {
  activeStory: GenericStoryItem;
  canNext: boolean;
  canPrev: boolean;
} = throwError;

export let useStoryProgress: (slug: string) => number = throwError;

export let useStoryIsMuted: () => boolean = throwError;

function createStoriesStore({
  initialActiveIndex = 0,
  onNext,
  onPrev,
  stories,
}: UseInitStoriesStoreParams) {
  const initialProgress = stories.reduce<Record<string, number>>(
    (progressObj, story, index) => {
      progressObj[story.slug] = index < initialActiveIndex ? 100 : 0;
      return progressObj;
    },
    {},
  );

  const totalStories = stories.length;

  function isNextAvailable(activeIndex: number) {
    return activeIndex < totalStories - 1;
  }

  function isPrevAvailable(activeIndex: number) {
    return activeIndex > 0;
  }

  function getStoryNavState(
    index: number,
  ): Pick<
    StoriesStore,
    | 'activeIndex'
    | 'activeStory'
    | 'isNextStoryAvailable'
    | 'isPrevStoryAvailable'
  > {
    return {
      activeIndex: index,
      activeStory: { ...stories[index] },
      isNextStoryAvailable: isNextAvailable(index),
      isPrevStoryAvailable: isPrevAvailable(index),
    };
  }

  const store = createStore<StoriesStore>((set, get) => {
    return {
      ...getStoryNavState(initialActiveIndex),
      isMuted: false,
      progress: { ...initialProgress },

      goToNextStory() {
        const { activeIndex, activeStory, progress } = get();
        const newIndex = activeIndex + 1;
        if (newIndex >= totalStories) return;

        const prevSlug = activeStory.slug;
        const newStoryNavState = getStoryNavState(newIndex);
        const newSlug = newStoryNavState.activeStory.slug;
        set({
          ...newStoryNavState,
          progress: { ...progress, [prevSlug]: 100, [newSlug]: 0 },
        });
        onNext?.(newStoryNavState.activeStory);
      },

      goToPrevStory() {
        const { activeIndex, activeStory, progress } = get();
        const newIndex = activeIndex - 1;
        if (newIndex < 0) return;

        const prevSlug = activeStory.slug;
        const newStoryNavState = getStoryNavState(newIndex);
        const newSlug = newStoryNavState.activeStory.slug;
        set({
          ...newStoryNavState,
          progress: { ...progress, [prevSlug]: 0, [newSlug]: 0 },
        });
        onPrev?.(newStoryNavState.activeStory);
      },

      setActiveStory(slug) {
        const newActiveIndex = stories.findIndex(
          story => story.slug === slug,
        );

        if (
          newActiveIndex < 0 ||
          newActiveIndex === get().activeIndex
        ) {
          return;
        }

        set(getStoryNavState(newActiveIndex));
      },

      setProgress(slug, value) {
        set({ progress: { ...get().progress, [slug]: value } });
      },

      toggleAudio() {
        set({ isMuted: !get().isMuted });
      },
    };
  });

  const state = store.getState();
  goToNextStory = state.goToNextStory;
  goToPrevStory = state.goToPrevStory;
  setActiveStory = state.setActiveStory;
  setStoryProgress = state.setProgress;
  toggleStoryAudio = state.toggleAudio;

  return store;
}

export function useInitStoriesStore({
  initialActiveIndex,
  onNext,
  onPrev,
  stories,
}: UseInitStoriesStoreParams) {
  const { submit } = useFetcher();
  const submitRef = useRef(submit);
  const storeRef = useRef<ReturnType<typeof createStoriesStore>>();

  if (!storeRef.current) {
    storeRef.current = createStoriesStore({
      initialActiveIndex,
      onNext,
      onPrev,
      stories,
    });
  }

  useActiveStory = () => {
    return useStore(storeRef.current!, store => ({
      activeStory: store.activeStory,
      canNext: store.isNextStoryAvailable,
      canPrev: store.isPrevStoryAvailable,
    }));
  };

  useStoryProgress = slug => {
    return useStore(storeRef.current!, store => store.progress[slug]);
  };

  useStoryIsMuted = () => {
    return useStore(storeRef.current!, store => store.isMuted);
  };

  useEffect(() => {
    function handleCloseOrPop() {
      const store = storeRef.current;
      if (!store) return;

      const { activeStory, isNextStoryAvailable } = store.getState();
      submitRef.current(
        {
          lastOpenedStory: isNextStoryAvailable
            ? activeStory.slug
            : '',
        },
        { action: '/action/set-last-opened-story', method: 'post' },
      );
    }

    window.addEventListener('beforeunload', handleCloseOrPop);
    window.addEventListener('popstate', handleCloseOrPop);

    return () => {
      window.removeEventListener('beforeunload', handleCloseOrPop);
      window.removeEventListener('popstate', handleCloseOrPop);
    };
  }, []);
}
