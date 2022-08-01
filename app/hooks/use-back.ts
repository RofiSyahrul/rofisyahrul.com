import { useCallback } from 'react';

import { useNavigate } from '@remix-run/react';

import { storageKeys } from '~/constants/storage-keys';

export function useBack() {
  const navigate = useNavigate();

  const back = useCallback(() => {
    const isInternalRouting =
      sessionStorage.getItem(storageKeys.isInternalRouting) ===
      'true';

    if (isInternalRouting) {
      navigate(-1);
    } else {
      window.location.pathname = '/';
    }
  }, [navigate]);

  return back;
}
