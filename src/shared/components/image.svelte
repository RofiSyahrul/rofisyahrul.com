<script lang="ts">
  import { onMount } from 'svelte';

  import {
    cancelIdleCallback,
    requestIdleCallback,
  } from '@/shared/lib/client/idle-callback';
  import observeIntersection from '@/shared/lib/client/observe-intersection';
  import { colorMode } from '@/shared/stores/color-mode';
  import noop from '@/shared/utils/noop';

  export let alt: string;
  export let src: string;

  export let height: string | number | undefined = undefined;
  export let loading: 'lazy' | 'eager' = 'lazy';
  export let observerRoot: Element | undefined = undefined;
  export let observerRootMargin: string | undefined = undefined;
  export let title: string | undefined = undefined;
  export let width: string | number | undefined = undefined;

  let className: string | undefined = undefined;
  export { className as class };

  const emptyDataURLDark =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0dgw1BgACdgD+5MErbwAAAABJRU5ErkJggg==';

  const emptyDataURLLight =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8ffWhDwAHwwLPPkxXsQAAAABJRU5ErkJggg==';

  let imgElement: HTMLImageElement;
  let isVisible = false;
  let loadedSrc = emptyDataURLLight;

  $: isEager = loading === 'eager';

  function handleIntersection(visible: boolean) {
    if (visible) {
      isVisible = true;
    }
  }

  onMount(() => {
    if (isEager) return noop;

    if (typeof IntersectionObserver === 'function') {
      return observeIntersection(imgElement, handleIntersection, {
        root: observerRoot,
        rootMargin: observerRootMargin,
      });
    } else {
      const idleCallback = requestIdleCallback(() => {
        isVisible = true;
      });
      return () => cancelIdleCallback(idleCallback);
    }
  });

  $: if (isVisible || isEager) {
    loadedSrc = src;
  } else if ($colorMode === 'dark') {
    loadedSrc = emptyDataURLDark;
  }
</script>

<img
  bind:this={imgElement}
  decoding="async"
  src={loadedSrc}
  class={className}
  {alt}
  {loading}
  {title}
  {height}
  {width}
/>
