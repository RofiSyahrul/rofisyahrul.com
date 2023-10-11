<script lang="ts">
  import Image from '@/shared/components/image.svelte';
  import type { SimpleMediaItem } from '@/shared/types/general';

  export let isActive: boolean;
  export let media: SimpleMediaItem;
  export let scrollerElement: HTMLDivElement;
  export let shouldEagerImageLoading: boolean;

  $: ({ alt, height, mime, resourceType, url, width } = media);
</script>

<div aria-current={isActive} class="carousel-item">
  <div class="carousel-item__sizer">
    {#if resourceType === 'image'}
      <Image
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
      <video title={alt} controls {height} {width}>
        <source src={url} type={mime} />
        <track kind="captions" />
        Sorry, your browser doesn't support embedded videos.
      </video>
    {/if}
  </div>
</div>

<style>
  .carousel-item {
    flex: 1 0 100%;
    scroll-snap-align: start;
  }

  .carousel-item__sizer {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
  }

  .carousel-item :global(img),
  .carousel-item video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
