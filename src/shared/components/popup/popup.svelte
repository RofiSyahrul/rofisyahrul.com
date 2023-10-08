<script lang="ts">
  import goBack from '@/shared/lib/client/go-back';

  import BasePopup from './base-popup.svelte';

  let className = '';
  export { className as class };
</script>

<BasePopup class={className} isOpen on:close={goBack}>
  <slot />
</BasePopup>
