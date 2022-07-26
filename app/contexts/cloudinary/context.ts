import { createContext } from 'react';

import type { Cloudinary } from '@cloudinary/url-gen';

export const CloudinaryContext = createContext<
  Cloudinary | undefined
>(undefined);
