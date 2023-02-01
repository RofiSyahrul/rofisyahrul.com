let queueList: Array<[string, any]> = [];

function trackQueueList(umami: Umami) {
  for (const [eventName, eventData] of queueList) {
    umami.trackEvent(eventName, eventData);
  }
  queueList = [];
}

export function trackEvent<
  TData extends Record<string, any> = Record<string, any>,
>(eventName: string, eventData?: TData) {
  const { pathname, search } = window.location;
  const url = `${pathname}${search}`;

  eventData = {
    url,
    ...eventData,
  } as any;

  if (!window.umami) {
    queueList.push([eventName, eventData]);
    return;
  }

  if (queueList.length) {
    trackQueueList(window.umami);
  }

  window.umami.trackEvent(eventName, eventData);
}
