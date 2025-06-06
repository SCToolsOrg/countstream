<script lang="ts">
  import Odometer from "$lib/components/odometer.svelte";
  import CustomizationProvider from "../customization-provider.svelte";
  import { getEmbedState } from "../state.svelte";

  const { count, countIndex, info, counts } = getEmbedState();
  const currentCount = count.counts[countIndex];
</script>

<CustomizationProvider />
<div class="flex w-full flex-col items-center justify-center text-center">
  <img
    src={info.avatar}
    alt={info.name + " avatar"}
    class="h-20 w-20 rounded-full"
  />
  <h1 class="mt-2 text-2xl">{info.name}</h1>
  <p class="text-muted-foreground text-sm">{info.username}</p>
  <Odometer
    class="font-count text-5xl !leading-[1.2em] sm:text-7xl xl:text-9xl"
    value={counts()[countIndex] ?? 0}
  />
  <div class="text-muted-foreground flex items-center gap-1.5 text-sm">
    <currentCount.icon class="h-4 w-4" />
    {currentCount.name}
  </div>
</div>
