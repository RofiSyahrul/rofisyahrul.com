<script lang="ts">
  import Image from '@/shared/components/image.svelte';
  import type { SpotifyNowPlayingData } from '@/shared/types/spotify';

  export let data: SpotifyNowPlayingData;

  $: ({ artists, image, title, trackURL } = data);
</script>

<div class="detail text-base">
  {#if image?.url}
    <Image
      alt={title}
      src={image.url}
      height={image.height}
      width={image.width}
      class="detail__image"
    />
  {/if}

  <div class="detail__content">
    <a
      href={trackURL}
      target="_blank"
      rel="noreferrer noopener"
      title="Play in Spotify"
      class="detail__link text-lg"
    >
      {title}
    </a>
    <strong>{artists.join(', ')}</strong>
  </div>
</div>

<style>
  .detail {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .detail :global(.detail__image) {
    object-fit: contain;
    border-radius: 4px;
  }

  .detail__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail__link {
    font-weight: 600;
    color: var(--color-secondary-dim);
  }

  :global(.dark) .detail__link {
    color: var(--color-secondary-bright);
  }

  .detail__link::after {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    content: '';
  }

  @media (min-width: 1024px) {
    .detail {
      gap: 12px;
    }
  }
</style>
