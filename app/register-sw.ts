async function handleLoad() {
  try {
    await navigator.serviceWorker.register('/sw.js', {
      type: 'module',
    });
    await navigator.serviceWorker.ready;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Service worker registration failed', error);
  }
}

export default function registerSW() {
  if (
    process.env.NODE_ENV === 'production' &&
    'serviceWorker' in navigator
  ) {
    window.addEventListener('load', handleLoad);
  }
}
