import { createStore, useStore } from 'zustand';

const store = createStore<WindowEnv>(() => ({
  APP_URL: '',
  PUBLIC_ANALYTICS_SCRIPT_URL: '',
  PUBLIC_ANALYTICS_VIEW_URL: '',
  PUBLIC_ANALYTICS_WEB_ID: '',
  REPOSITORY_URL: '',
}));

export function setPublicEnv(env?: WindowEnv) {
  store.setState(env ?? {});
  return store;
}

export const usePublicEnv = () => useStore(store);
