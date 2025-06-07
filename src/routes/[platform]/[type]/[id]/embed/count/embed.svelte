<script lang="ts">
  import Odometer from "$lib/components/odometer.svelte";
  import CustomizationProvider from "../customization-provider.svelte";
  import { getEmbedState } from "../state.svelte";

  const embedState = getEmbedState();

  const { countIndex, counts } = embedState;

  const sizes: Record<string, string> = {
    small: "18px",
    medium: "36px",
    large: "60px",
    "extra-large": "120pt",
  };
</script>

<CustomizationProvider />
<Odometer
  class="font-count w-full"
  style="font-size: {sizes[
    embedState.size ?? 'medium'
  ]}; text-align: {embedState.align ?? 'left'}"
  value={counts()[countIndex] ?? 0}
/>
