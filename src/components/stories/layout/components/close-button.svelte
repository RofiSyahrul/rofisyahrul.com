<script lang="ts">
  import Close from '@/shared/icons/close.svelte';
  import goBack from '@/shared/lib/client/go-back';
</script>

<button
  class="btn btn-text text-inherit"
  title="Close"
  on:click={goBack}
>
  <Close ariaLabel="Close" size={20} />
  <span class="visually-hidden">Close</span>
</button>
