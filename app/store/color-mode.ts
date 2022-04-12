import { useCallback, useEffect, useRef } from 'react';

import { useFetcher } from 'remix';
import create from 'zustand';

import type { ColorMode } from '~/lib/color-mode';

interface ColorModeStore {
  colorMode: ColorMode | null;
  setColorMode(colorMode: ColorMode): ColorMode;
  toggleColorMode(): ColorMode;
}

const useColorModeStore = create<ColorModeStore>((set, get) => ({
  colorMode: null,
  setColorMode(colorMode) {
    set({ colorMode });
    return colorMode;
  },
  toggleColorMode() {
    const prevColorMode = get().colorMode;
    const newColorMode: ColorMode =
      prevColorMode === 'dark' ? 'light' : 'dark';
    set({ colorMode: newColorMode });
    return newColorMode;
  },
}));

function getColorMode(colorMode: ColorMode | null): ColorMode {
  return colorMode === 'dark' ? 'dark' : 'light';
}

function colorModeSelector(state: ColorModeStore): ColorMode {
  return getColorMode(state.colorMode);
}

export function useColorMode(): ColorMode {
  return useColorModeStore(colorModeSelector);
}

interface UseInitColorModeReturn {
  colorMode: ColorMode;
}

const prefersDarkMQ = '(prefers-color-scheme: dark)';

export function useInitColorMode(
  initialColorMode: ColorMode | null,
): UseInitColorModeReturn {
  const persistColorMode = useFetcher();
  const persistColorModeRef = useRef(persistColorMode);

  useEffect(() => {
    persistColorModeRef.current = persistColorMode;
  }, [persistColorMode]);

  const selector = useCallback(
    (state: ColorModeStore) => {
      return {
        colorMode: getColorMode(state.colorMode ?? initialColorMode),
        setColorMode() {
          if (initialColorMode) {
            state.setColorMode(initialColorMode);
            return;
          }

          const isPreferDark =
            window.matchMedia(prefersDarkMQ).matches;
          const preferedColorMode: ColorMode = isPreferDark
            ? 'dark'
            : 'light';
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(preferedColorMode);
          persistColorModeRef.current.submit(
            { colorMode: preferedColorMode },
            { action: '/action/set-color-mode', method: 'post' },
          );
        },
      };
    },
    [initialColorMode],
  );

  const { colorMode, setColorMode } = useColorModeStore(selector);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    setColorMode();
    isMounted.current = true;
  }, [setColorMode]);

  return { colorMode };
}

export function useToggleColorMode(): () => void {
  const persistColorMode = useFetcher();
  const persistColorModeRef = useRef(persistColorMode);

  useEffect(() => {
    persistColorModeRef.current = persistColorMode;
  }, [persistColorMode]);

  const toggleColorModeSelector = useCallback(
    (state: ColorModeStore) => () => {
      const colorMode = state.toggleColorMode();
      persistColorModeRef.current.submit(
        { colorMode },
        { action: '/action/set-color-mode', method: 'post' },
      );
    },
    [],
  );

  return useColorModeStore(toggleColorModeSelector);
}
