import { useContext } from 'react';

import type { UserAgent } from '~/types/general';

import { UserAgentContext } from './context';

export function useUserAgent(): UserAgent {
  const ctx = useContext(UserAgentContext);

  if (typeof ctx === 'undefined') {
    throw new Error(
      'useUserAgent is used outside UserAgentContext.Provider',
    );
  }

  return ctx;
}
