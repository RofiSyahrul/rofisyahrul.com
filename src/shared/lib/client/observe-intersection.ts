type IntersectionOptions = Pick<
  IntersectionObserverInit,
  'rootMargin' | 'root'
>;

type ObserveCallback = (isVisible: boolean) => void;

type Identifier = Required<IntersectionOptions>;

interface Observer {
  elements: Map<Element, ObserveCallback>;
  id: Identifier;
  observer: IntersectionObserver;
}

const observers = new Map<Identifier, Observer>();

function createObserver({
  root,
  rootMargin,
}: IntersectionOptions): Observer {
  const id: Identifier = {
    root: root ?? null,
    rootMargin: rootMargin ?? '0px',
  };

  let instance = observers.get(id);
  if (instance) return instance;

  const elements = new Map<Element, ObserveCallback>();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const callback = elements.get(entry.target);
      const isVisible =
        entry.isIntersecting || entry.intersectionRatio > 0;
      if (callback && isVisible) {
        callback(isVisible);
      }
    });
  }, id);

  instance = {
    elements,
    id,
    observer,
  };

  observers.set(id, instance);

  return instance;
}

export default function observeIntersection(
  element: Element,
  callback: ObserveCallback,
  options: IntersectionOptions = {},
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
    }
  };
}
