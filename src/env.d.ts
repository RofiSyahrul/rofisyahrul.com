/// <reference types="astro/client" />

import type { ColorMode } from './shared/lib/color-mode';
import type { UserAgent } from './shared/types/user-agent';

declare global {
  namespace App {
    interface Locals {
      colorMode: ColorMode;
      userAgent: UserAgent;
    }
  }

  interface ImportMetaEnv {
    readonly PUBLIC_ANALYTICS_SCRIPT_URL: string;
    readonly PUBLIC_ANALYTICS_VIEW_URL: string;
    readonly PUBLIC_ANALYTICS_WEB_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Array<T> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: T, fromIndex?: number): boolean;
    includes(
      searchElement: unknown,
      fromIndex?: number,
    ): searchElement is T;
  }

  interface Set<T> {
    /**
     * @returns a boolean indicating whether an element with the specified value exists in the Set or not.
     */
    has(value: T): boolean;
    has(value: unknown): value is T;
  }
}
