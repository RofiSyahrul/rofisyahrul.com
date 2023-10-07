import tryCatch from './try-catch';

const IS_INTERNAL_ROUTING_KEY = 'aXNJbnRlcm5hbFJvdXRpbmc=';

export function isInternalRouting(): boolean {
  return tryCatch(
    () => sessionStorage.getItem(IS_INTERNAL_ROUTING_KEY) === 'true',
    () => false,
  );
}

export function setInternalRoutingStorage() {
  tryCatch(() => {
    sessionStorage.setItem(IS_INTERNAL_ROUTING_KEY, 'true');
  });
}
