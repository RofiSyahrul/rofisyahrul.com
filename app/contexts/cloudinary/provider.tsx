import type { ReactNode } from 'react';

import { Cloudinary } from '@cloudinary/url-gen';

import { CloudinaryContext } from './context';

interface CloudinaryProviderProps {
  children: ReactNode;
}

const cld = new Cloudinary({
  cloud: {
    cloudName: 'rofi',
  },
});

export function CloudinaryProvider({
  children,
}: CloudinaryProviderProps) {
  return (
    <CloudinaryContext.Provider value={cld}>
      {children}
    </CloudinaryContext.Provider>
  );
}
