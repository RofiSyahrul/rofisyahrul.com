import { createContext } from 'react';

import type { UserAgent } from '~/types/general';

export const UserAgentContext = createContext<UserAgent | undefined>(
  undefined,
);
