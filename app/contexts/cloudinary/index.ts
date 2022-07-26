import { useContext, useRef } from 'react';

import { CloudinaryContext } from './context';

export function useCldImage(publicId: string) {
  const cld = useContext(CloudinaryContext);

  if (typeof cld === 'undefined') {
    throw new Error(
      'useCldImage was outside of `CloudinaryProvider`',
    );
  }

  const cldImageRef = useRef(cld.image(publicId));
  return cldImageRef.current;
}

export function useCldVideo(publicId: string) {
  const cld = useContext(CloudinaryContext);

  if (typeof cld === 'undefined') {
    throw new Error(
      'useCldVideo was outside of `CloudinaryProvider`',
    );
  }

  const cldVideoRef = useRef(cld.video(publicId));
  return cldVideoRef.current;
}
