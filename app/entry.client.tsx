import { hydrateRoot } from 'react-dom/client';

import { RemixBrowser } from '@remix-run/react';

import registerSW from './register-sw';

hydrateRoot(document, <RemixBrowser />);
registerSW();
