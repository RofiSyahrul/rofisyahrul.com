<script lang="ts">
  import Image from '@/shared/components/image.svelte';
  import type { SimpleMediaItem } from '@/shared/types/general';

  export let isActive: boolean;
  export let media: SimpleMediaItem;
  export let scrollerElement: HTMLDivElement;
  export let shouldEagerImageLoading: boolean;

  let className: string;
  export { className as class };

  $: ({ alt, height, mime, resourceType, url, width } = media);
</script>

<div
  aria-current={isActive}
  class="scroll-snap-start flex-grow flex-shrink-0 flex-basis items-center justify-center"
>
  <div class="relative w-full pb-[100%]">
    {#if resourceType === 'image'}
      <Image
        class={className}
        observerRoot={scrollerElement}
        observerRootMargin="-8px"
        src={url}
        title={alt}
        loading={shouldEagerImageLoading ? 'eager' : 'lazy'}
        {alt}
        {height}
        {width}
      />
    {:else if resourceType === 'video' && (mime === 'video/webm' || mime === 'video/mp4')}
      <video class={className} title={alt} controls {height} {width}>
        <source src={url} type={mime} />
        <track kind="captions" />
        Sorry, your browser doesn't support embedded videos.
      </video>
    {/if}
  </div>
</div>
