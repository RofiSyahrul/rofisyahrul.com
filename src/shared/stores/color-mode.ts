import { writable } from 'svelte/store';

import type { ColorMode } from '@/shared/lib/color-mode';

export const colorMode = writable<ColorMode>('light');
