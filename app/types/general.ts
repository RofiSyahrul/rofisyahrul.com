import type { ReactNode } from 'react';

export interface Item<TName extends string = string> {
  iconPath: ReactNode;
  name: TName;
  url: string;
}

export type MediaResourceType = 'image' | 'video';

export interface SimpleMediaItem {
  alt: string;
  height: number;
  mime: string;
  resourceType: MediaResourceType;
  url: string;
  width: number;
}

interface UABrowser {
  name: string;
  version: string;
}

interface UADevice {
  model: string;
  type: string;
  vendor: string;
}

export interface UserAgent {
  browser: UABrowser;
  device: UADevice;
  isMobile: boolean;
}
