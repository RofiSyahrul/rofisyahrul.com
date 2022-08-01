import { useEffect } from 'react';

export function useScrollLock(shouldLock: boolean) {
  useEffect(() => {
    const initialOverflowStyle = document.body.style.overflow;

    if (shouldLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = initialOverflowStyle;
    }

    return () => {
      document.body.style.overflow = initialOverflowStyle;
    };
  }, [shouldLock]);
}
