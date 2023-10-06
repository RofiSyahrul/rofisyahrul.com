<script lang="ts">
  import { onMount } from 'svelte';

  import observeIntersection from '@/shared/lib/client/observe-intersection';
  import { colorMode } from '@/shared/stores/color-mode';
  import noop from '@/shared/utils/noop';

  export let alt: string;
  export let src: string;

  export let height: string | number | undefined;
  export let loading: 'lazy' | 'eager' = 'lazy';
  export let observerRoot: Element | undefined;
  export let observerRootMargin: string | undefined;
  export let title: string | undefined;
  export let width: string | number | undefined;

  let className: string | undefined;
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

    return observeIntersection(imgElement, handleIntersection, {
      root: observerRoot,
      rootMargin: observerRootMargin,
    });
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