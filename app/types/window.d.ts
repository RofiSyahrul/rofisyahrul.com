interface WindowEnv {
  readonly APP_URL: string;
  readonly PUBLIC_ANALYTICS_SCRIPT_URL: string;
  readonly PUBLIC_ANALYTICS_VIEW_URL: string;
  readonly PUBLIC_ANALYTICS_WEB_ID: string;
  readonly REPOSITORY_URL: string;
}

interface Umami {
  (eventName: string): void;
  trackEvent<TData>(eventName: string, eventData?: TData): void;
}

interface Window {
  ENV: WindowEnv;
  umami?: Umami;
}
