import type { SyntheticEvent } from 'react';
import { useEffect, useRef } from 'react';

import { createStore, useStore } from 'zustand';

import type { GenericStoryItem } from '~/types/stories';

export type StoriesCloseHandler = (
  params: Pick<StoriesStore, 'isNextStoryAvailable' | 'activeStory'>,
) => void;

export interface UseInitStoriesStoreParams {
  initialActiveIndex?: number;
  onClose: StoriesCloseHandler;
  onNext?: (newActiveStory: GenericStoryItem) => void;
  onPrev?: (newActiveStory: GenericStoryItem) => void;
  stories: GenericStoryItem[];
}

type CreateStoriesStoreParams = Omit<
  UseInitStoriesStoreParams,
  'onClose'
>;

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
  setActiveStoryProgress(value: number): void;
  toggleAudio(): 'on' | 'off';
}

function throwError(): never {
  throw new Error('stories store has not been initialized');
}

export let goToNextStory: StoriesStore['goToNextStory'] = throwError;
export let goToPrevStory: StoriesStore['goToPrevStory'] = throwError;
export let setActiveStory: StoriesStore['setActiveStory'] =
  throwError;

let setActiveStoryProgress: StoriesStore['setActiveStoryProgress'] =
  throwError;

export let toggleStoryAudio: StoriesStore['toggleAudio'] = throwError;

export let useActiveStory: <
  T extends GenericStoryItem = GenericStoryItem,
>() => {
  activeIndex: number;
  activeStory: T;
  canNext: boolean;
  canPrev: boolean;
} = throwError;

export let useStoryProgress: (slug: string) => number = throwError;

export let useStoryIsMuted: () => boolean = throwError;

export function handleTimeUpdate(
  event: SyntheticEvent<HTMLAudioElement | HTMLVideoElement>,
) {
  const { currentTime, duration } = event.currentTarget;
  setActiveStoryProgress((currentTime * 100) / duration);
}

function createStoriesStore({
  initialActiveIndex = 0,
  onNext,
  onPrev,
  stories,
}: CreateStoriesStoreParams) {
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

      setActiveStoryProgress(value) {
        const { activeStory, progress } = get();
        set({ progress: { ...progress, [activeStory.slug]: value } });
      },

      toggleAudio() {
        const isMuted = !get().isMuted;
        set({ isMuted });
        return isMuted ? 'off' : 'on';
      },
    };
  });

  const state = store.getState();
  goToNextStory = state.goToNextStory;
  goToPrevStory = state.goToPrevStory;
  setActiveStory = state.setActiveStory;
  setActiveStoryProgress = state.setActiveStoryProgress;
  toggleStoryAudio = state.toggleAudio;

  return store;
}

export function useInitStoriesStore({
  initialActiveIndex,
  onClose,
  onNext,
  onPrev,
  stories,
}: UseInitStoriesStoreParams) {
  const onCloseRef = useRef(onClose);
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
      activeIndex: store.activeIndex,
      activeStory: store.activeStory as any,
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
      onCloseRef.current({ activeStory, isNextStoryAvailable });
    }

    window.addEventListener('beforeunload', handleCloseOrPop);
    window.addEventListener('popstate', handleCloseOrPop);

    return () => {
      window.removeEventListener('beforeunload', handleCloseOrPop);
      window.removeEventListener('popstate', handleCloseOrPop);
    };
  }, []);
}
