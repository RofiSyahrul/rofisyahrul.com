<script lang="ts">
  import {
    ONE_HOUR_IN_MINUTES,
    ONE_SECOND_IN_MS,
    ONE_MINUTE_IN_SECONDS,
  } from '@/shared/constants/times';
  import Spotify from '@/shared/icons/spotify.svelte';
  import { activeStory } from '@/shared/stores/stories';

  function getTimeDiff(timestamp?: string) {
    if (!timestamp) return null;

    const now = Date.now();
    const timestampTime = new Date(timestamp).getTime();
    const diffInSeconds = Math.floor(
      (now - timestampTime) / ONE_SECOND_IN_MS,
    );

    if (diffInSeconds <= 0) return 'Just now';

    const diffInMinutes = Math.floor(
      diffInSeconds / ONE_MINUTE_IN_SECONDS,
    );

    const secondsRem =
      diffInMinutes - ONE_MINUTE_IN_SECONDS * diffInMinutes;

    if (diffInMinutes === 0) {
      return secondsRem + 's';
    }

    const diffInHours = Math.floor(
      diffInMinutes / ONE_HOUR_IN_MINUTES,
    );

    const minutesRem =
      diffInMinutes - ONE_HOUR_IN_MINUTES * diffInHours;

    const diffInSecondsText =
      secondsRem > 0 ? ' ' + secondsRem + 's' : '';

    if (diffInHours === 0) {
      return minutesRem + 'm' + diffInSecondsText;
    }

    const diffInHoursText = diffInHours + 'h';

    if (minutesRem === 0) {
      return diffInHoursText + diffInSecondsText;
    }

    return diffInHoursText + ' ' + minutesRem + 'm';
  }

  $: ({ slug, title, timestamp } = $activeStory.story);
  $: timeDiff = getTimeDiff(timestamp);
</script>

<div class="title">
  {#if slug.startsWith('spotify-')}
    <Spotify class="text-secondary-bright" />
  {/if}

  <h1>{title}</h1>

  {#if timeDiff}
    <span class="time-diff">{timeDiff}</span>
  {/if}
</div>

<style>
  .title {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  :global(.dark) .title h1,
  .title h1,
  .time-diff {
    font-size: 16px;
    line-height: 24px;
  }

  :global(.dark) .title h1,
  .title h1 {
    font-weight: 600;
    color: var(--color-neutral-bright);
  }

  .time-diff {
    color: var(--color-neutral-bright2);
  }
</style>
