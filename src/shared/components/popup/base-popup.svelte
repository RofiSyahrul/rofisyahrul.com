<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';

  import Close from '@/shared/icons/close.svelte';
  import { isBrowser } from '@/shared/lib/client/env';

  type PopupEventMap = {
    close: MouseEvent;
  };

  type AnimationType = 'enter' | 'leave' | null;

  export let isOpen = false;

  let className = '';
  export { className as class };

  export type { PopupEventMap };

  let animationType: AnimationType = null;
  let isShown = false;
  let lastFocusedElement: Element | null = null;
  let popupElement: HTMLDivElement;

  const dispatch = createEventDispatcher<PopupEventMap>();

  const initialOverflowStyle = isBrowser
    ? document.documentElement.style.overflow
    : '';

  function closePopup() {
    animationType = 'leave';
    (lastFocusedElement as HTMLButtonElement)?.focus?.();
  }

  function handlePopupClose(e: MouseEvent) {
    closePopup();
    dispatch('close', e);
  }

  function handlePopupClick(e: MouseEvent) {
    if (isShown && e.target === popupElement) handlePopupClose(e);
  }

  function handlePopupAnimationEnd() {
    if (animationType === 'leave') isShown = false;
  }

  onDestroy(() => {
    closePopup();
  });

  onMount(() => {
    return () => {
      document.body.style.overflow = initialOverflowStyle;
    };
  });

  $: {
    if (isOpen) {
      animationType = 'enter';
      isShown = true;
    } else {
      animationType = 'leave';
    }
  }

  $: if (isBrowser) {
    if (isShown) {
      document.documentElement.style.overflow = 'hidden';
      lastFocusedElement = document.activeElement;
    } else {
      document.documentElement.style.overflow = initialOverflowStyle;
    }
  }
</script>

<div
  aria-hidden={!isShown}
  class="popup"
  class:popup_enter={animationType === 'enter'}
  class:popup_leave={animationType === 'leave'}
  on:animationend={handlePopupAnimationEnd}
  on:click={handlePopupClick}
  bind:this={popupElement}
>
  <button
    aria-label="Close"
    class="popup__close-btn"
    title="Close"
    type="button"
    on:click={handlePopupClose}
  >
    <Close />
    <span class="visually-hidden">Close</span>
  </button>

  <dialog class={clsx('popup__dialog', className)} open={isShown}>
    <slot />
  </dialog>
</div>

<style>
  @keyframes popup_fade-in {
    from {
      opacity: 0%;
    }
  }

  @keyframes popup_fade-out {
    to {
      opacity: 0%;
    }
  }

  @keyframes popup_zoom-in {
    from {
      transform: scale3d(0.3, 0.3, 0.3);
    }
  }

  @keyframes popup_zoom-out {
    to {
      transform: scale3d(0.3, 0.3, 0.3);
    }
  }

  .popup {
    @apply w-full h-full top-0 right-0 bottom-0 left-0;
    @apply fixed z-40 flex items-center justify-center;
    animation-duration: 0.2s;
    animation-timing-function: ease-out;
    animation-fill-mode: both;
    background-color: rgba(var(--rgb-neutral-dim2), 0.9);

    --popup-max-height: 90%;
    --popup-max-width: 95%;
  }

  .popup[aria-hidden='true'] {
    display: none;
  }

  .popup_enter {
    animation-name: popup_fade-in;
  }

  .popup_leave {
    animation-name: popup_fade-out;
    pointer-events: none;
  }

  .popup__close-btn {
    @apply absolute top-1 right-1;
    @apply w-6 h-6 flex items-center justify-center cursor-pointer;
    @apply text-neutral-bright bg-primary-dim shadow-lg;
    border-radius: 50%;
  }

  .popup__close-btn:hover {
    filter: brightness(80%);
    @apply shadow;
  }

  :global(.dark) .popup__close-btn {
    @apply text-neutral-dim bg-primary-bright;
  }

  .popup__dialog {
    @apply scrollbar-thin scrollbar-thumb-neutral-dim2 scrollbar-track-neutral-bright1;
    @apply scrollbar-track-neutral-dim1;
    @apply relative flex overflow-auto border-none rounded-lg shadow-xl;
    @apply text-neutral-dim bg-neutral-bright;
    max-height: var(--popup-max-height);
    max-width: var(--popup-max-width);
    width: 800px;
    animation-duration: inherit;
    animation-fill-mode: inherit;
  }

  :global(.dark) .popup__dialog {
    @apply scrollbar-thumb-neutral-bright2 text-neutral-bright bg-neutral-dim;
  }

  .popup_enter .popup__dialog {
    animation-name: popup_zoom-in;
    animation-timing-function: cubic-bezier(0.4, 0, 0, 1.5);
  }

  .popup_leave .popup__dialog {
    animation-name: popup_zoom-out;
  }
</style>
