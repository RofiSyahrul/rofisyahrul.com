import { isBrowser } from './env';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type AstroTransitonModule = typeof import('astro:transitions/client');

type Options = Parameters<AstroTransitonModule['navigate']>[1];

let astroTransitionsModule: AstroTransitonModule;

const DEFAULT_ASTRO_TRANSITION_MODULE: AstroTransitonModule = {
  navigate: () => {},
  supportsViewTransitions: true,
  transitionEnabledOnThisPage: () => false,
};

async function getAstroTransitonModule(): Promise<AstroTransitonModule> {
  if (astroTransitionsModule) return astroTransitionsModule;

  if (!isBrowser) {
    return DEFAULT_ASTRO_TRANSITION_MODULE;
  }

  try {
    astroTransitionsModule = await import('astro:transitions/client');
    return astroTransitionsModule;
  } catch {
    return DEFAULT_ASTRO_TRANSITION_MODULE;
  }
}

export async function navigate(href: string, options?: Options) {
  const transitionModule = await getAstroTransitonModule();
  return transitionModule.navigate(href, options);
}
