import type { ReactNode } from 'react';

import { cld } from '~/lib/cloudinary';

import { CloudinaryContext } from './context';

interface CloudinaryProviderProps {
  children: ReactNode;
}

export function CloudinaryProvider({
  children,
}: CloudinaryProviderProps) {
  return (
    <CloudinaryContext.Provider value={cld}>
      {children}
    </CloudinaryContext.Provider>
  );
}
