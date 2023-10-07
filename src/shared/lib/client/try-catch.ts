import noop from '@/shared/utils/noop';

function tryCatch<T, E = any>(
  callback: () => T,
  onError: (error: E) => T,
): T;

function tryCatch<T extends void = void, E = any>(
  callback: () => T,
  onError?: (error: E) => T,
): T;

function tryCatch(
  callback: () => any,
  onError: (error: any) => any = noop,
) {
  try {
    return callback() as unknown;
  } catch (error) {
    return onError(error) as unknown;
  }
}

export default tryCatch;
