<script lang="ts">
  import clsx from 'clsx';
  import type {
    MouseEventHandler,
    UIEventHandler,
  } from 'svelte/elements';

  import Arrow from '@/shared/icons/arrow.svelte';
  import type { SimpleMediaItem } from '@/shared/types/general';

  import CarouselItem from './carousel-item.svelte';

  export let mediaList: SimpleMediaItem[] = [];

  const totalMedia = mediaList.length;
  const indicatorIndices = Array.from(
    { length: totalMedia },
    (_, index) => index,
  );

  let scrollerElement: HTMLDivElement;
  let activeIndex = 0;
  let isFirstIndex = true;
  let isLastIndex = false;
  let translateXIndicator = 0;

  function getTranslateXIndicator(
    currentActiveIndex: number,
  ): number {
    const startThreshold = 2;

    if (currentActiveIndex < startThreshold) return 0;

    const endThreshold = totalMedia - 4;
    if (currentActiveIndex > endThreshold) {
      const endCenteringIndex = totalMedia - 5;
      return endCenteringIndex * 10;
    }

    const startCenteringIndex = currentActiveIndex - startThreshold;
    return startCenteringIndex * 10;
  }

  function updateIndex(index: number) {
    let newIndex = index;
    if (index < 0) newIndex = 0;
    else if (index >= totalMedia) newIndex = totalMedia - 1;

    scrollerElement.scrollTo({
      left: scrollerElement.clientWidth * newIndex,
      top: 0,
      behavior: 'smooth',
    });
  }

  const handlePrevClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    updateIndex(activeIndex - 1);
  };

  const handleNextClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    updateIndex(activeIndex + 1);
  };

  const handleScroll: UIEventHandler<HTMLDivElement> = e => {
    const scroller = e.currentTarget;
    const nextIndex = Math.round(
      scroller.scrollLeft / scroller.clientWidth,
    );
    if (nextIndex !== activeIndex) {
      activeIndex = nextIndex;
    }
  };

  $: {
    isFirstIndex = activeIndex === 0;
    isLastIndex = activeIndex === totalMedia - 1;
    translateXIndicator = getTranslateXIndicator(activeIndex);
  }
</script>

<div class="carousel">
  <div
    bind:this={scrollerElement}
    on:scroll={handleScroll}
    class="scrollbar-none relative w-full overflow-x-scroll scroll-snap-x"
  >
    <div class="flex transition-transform">
      {#each mediaList as media, index (media.url)}
        <CarouselItem
          {media}
          {scrollerElement}
          class="absolute top-0 left-0 w-full h-full"
          isActive={activeIndex === index}
          shouldEagerImageLoading={index === 0}
        />
      {/each}
    </div>
  </div>

  {#if mediaList.length > 1}
    <div
      class={clsx(
        'my-4 mx-auto max-w-[56px] overflow-x-hidden',
        'flex transition-all gap-1',
      )}
      style:transform={`translate3D(${translateXIndicator}, 0, 0)`}
    >
      {#each indicatorIndices as index}
        <span
          aria-current={index === activeIndex ? 'step' : 'false'}
          class="carousel__indicator-item"
        />
      {/each}
    </div>

    <button
      aria-hidden={isFirstIndex}
      class="carousel__arrow carousel__arrow_prev"
      disabled={isFirstIndex}
      on:click={handlePrevClick}
    >
      <Arrow />
      <span class="visually-hidden">Previous</span>
    </button>

    <button
      aria-hidden={isLastIndex}
      class="carousel__arrow carousel__arrow_next"
      disabled={isLastIndex}
      on:click={handleNextClick}
    >
      <Arrow />
      <span class="visually-hidden">Next</span>
    </button>
  {/if}
</div>

<style>
  .carousel {
    @apply relative w-full bg-neutral-bright;
  }

  :global(.dark) .carousel {
    @apply bg-neutral-dim;
  }

  .carousel__indicator-item {
    @apply flex-grow-0 flex-shrink-0 flex-basis-auto;
    @apply w-2 h-2 bg-neutral-bright2 rounded-full;
  }

  .carousel__indicator-item[aria-current='step'] {
    @apply bg-neutral-dim;
  }

  :global(.dark) .carousel__indicator-item {
    @apply bg-neutral-dim2;
  }

  :global(.dark) .carousel__indicator-item[aria-current='step'] {
    @apply bg-neutral-bright;
  }

  .carousel__arrow {
    @apply absolute top-1/2 items-center justify-center w-7 h-7;
    @apply bg-neutral-bright0 text-neutral-dim;
    @apply rounded-full cursor-pointer border-none outline-none;
    @apply opacity-0 transition-opacity visible;
  }

  :global(.dark) .carousel__arrow {
    @apply bg-neutral-dim0 text-neutral-bright;
  }

  :global(.desktop) .carousel__arrow {
    display: flex;
  }

  :global(.mobile) .carousel__arrow {
    display: none;
  }

  .carousel:hover > .carousel__arrow {
    @apply shadow-lg opacity-100;
  }

  .carousel__arrow[aria-hidden='true'] {
    visibility: hidden;
  }

  .carousel__arrow_next {
    right: 10px;
    transform: rotate(180deg) translate(0, 50%);
  }

  .carousel__arrow_prev {
    left: 10px;
    transform: translate(0, -50%);
  }
</style>
