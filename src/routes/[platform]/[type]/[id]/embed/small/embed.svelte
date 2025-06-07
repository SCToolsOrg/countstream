<script lang="ts">
  import Odometer from "$lib/components/odometer.svelte";
  import CustomizationProvider from "../customization-provider.svelte";
  import { getEmbedState } from "../state.svelte";

  const { countIndex, info, counts } = getEmbedState();
</script>

<CustomizationProvider />
<div class="flex items-center gap-2">
  <img
    src={info.avatar}
    alt={info.name + " avatar"}
    width={90}
    height={90}
    class="size-[90px] rounded-full object-cover"
  />
  <div class="flex flex-col">
    <p>{info.name}</p>
    <Odometer value={counts()[countIndex]} class="font-count text-[50px]" />
  </div>
</div>
