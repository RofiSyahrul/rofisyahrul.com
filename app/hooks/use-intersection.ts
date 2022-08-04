// adapted from
// https://github.com/vercel/next.js/blob/canary/packages/next/client/use-intersection.tsx

import type { MutableRefObject, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

type IntersectionOptions = Pick<
  IntersectionObserverInit,
  'rootMargin' | 'root'
>;

export type UseIntersectionOptions = IntersectionOptions & {
  rootRef?: RefObject<HTMLElement> | null;
};

type ObserveCallback = (isVisible: boolean) => void;

type Identifier = {
  root: Element | Document | null;
  margin: string;
};

type Observer = {
  elements: Map<Element, ObserveCallback>;
  id: Identifier;
  observer: IntersectionObserver;
};

const requestIdleCallback =
  (typeof self !== 'undefined' &&
    self.requestIdleCallback &&
    self.requestIdleCallback.bind(window)) ||
  function (cb: IdleRequestCallback): number {
    const start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1) as unknown as number;
  };

const cancelIdleCallback =
  (typeof self !== 'undefined' &&
    self.cancelIdleCallback &&
    self.cancelIdleCallback.bind(window)) ||
  function (id: number) {
    return clearTimeout(id);
  };

const hasIntersectionObserver =
  typeof IntersectionObserver === 'function';

const observers = new Map<Identifier, Observer>();
const idList: Identifier[] = [];

function createObserver(options: IntersectionOptions): Observer {
  const id: Identifier = {
    margin: options.rootMargin ?? '0px',
    root: options.root ?? null,
  };

  let instance: Observer | undefined;
  const existingID = idList.find(
    item => item.margin === id.margin && item.root === id.root,
  );
  if (existingID) {
    instance = observers.get(existingID);
    if (instance) return instance;
  }

  const elements = new Map<Element, ObserveCallback>();
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const callback = elements.get(entry.target);
        const isVisible =
          entry.isIntersecting || entry.intersectionRatio > 0;
        if (callback && isVisible) {
          callback(isVisible);
        }
      });
    },
    { root: id.root, rootMargin: id.margin },
  );

  instance = {
    elements,
    id,
    observer,
  };

  idList.push(id);
  observers.set(id, instance);
  return instance;
}

function observe(
  element: Element,
  callback: ObserveCallback,
  options: IntersectionOptions,
): () => void {
  const { elements, id, observer } = createObserver(options);
  elements.set(element, callback);
  observer.observe(element);

  return function unobserve() {
    elements.delete(element);
    observer.unobserve(element);

    if (elements.size === 0) {
      observer.disconnect();
      observers.delete(id);
      const index = idList.findIndex(
        obj => obj.root === id.root && obj.margin === id.margin,
      );
      if (index > -1) {
        idList.splice(index, 1);
      }
    }
  };
}

export function useIntersection<T extends Element>({
  root,
  rootMargin,
  rootRef,
}: UseIntersectionOptions = {}): [
  MutableRefObject<T | null>,
  boolean,
] {
  const unobserve = useRef<() => void>();
  const elementRef = useRef<T | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hasIntersectionObserver) {
      if (unobserve.current) {
        unobserve.current();
        unobserve.current = undefined;
      }

      if (isVisible) return;

      if (elementRef.current && elementRef.current.tagName) {
        unobserve.current = observe(
          elementRef.current,
          visible => visible && setIsVisible(visible),
          { root: rootRef?.current ?? root, rootMargin },
        );
      }

      return () => {
        unobserve.current?.();
        unobserve.current = undefined;
      };
    } else if (!isVisible) {
      const idleCallback = requestIdleCallback(() =>
        setIsVisible(true),
      );
      return () => cancelIdleCallback(idleCallback);
    }
  }, [isVisible, root, rootMargin, rootRef]);

  return [elementRef, isVisible];
}
