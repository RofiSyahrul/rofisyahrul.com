import type { ReactNode } from 'react';

export interface Item {
  iconPath: ReactNode;
  name: string;
  url: string;
}

export type MediaResourceType = 'image' | 'video';

export interface SimpleMediaItem {
  alt: string;
  height: number;
  resourceType: MediaResourceType;
  url: string;
  width: number;
}
