import { worker } from './__config';
import {
  handleInstall,
  handleActivate,
  handleFetch,
} from './_handlers';

worker.addEventListener('install', handleInstall);
worker.addEventListener('activate', handleActivate);
worker.addEventListener('fetch', handleFetch);
