<script lang="ts">
  import Odometer from "$lib/components/odometer.svelte";
  import { untrack } from "svelte";
  import { getEmbedState } from "../state.svelte";
  import Hourglass from "@lucide/svelte/icons/hourglass";
  import CustomizationProvider from "../customization-provider.svelte";
  import { calculateGain, times } from "$lib/gains";

  const embedState = getEmbedState();
  const { countIndex, counts } = embedState;

  const enabledTimes = $derived(
    times.filter((t) => (embedState.times ?? "24h").includes(t[0]))
  );
  const align = $derived(embedState.align ?? "left");
  const icon = $derived(embedState.icon ?? true);
  const text = $derived(embedState.text ?? true);

  let history = $state.raw<number[]>([]);

  $effect(() => {
    const count = counts()[countIndex];

    const newHistory = [...untrack(() => history), count];
    if (newHistory.length >= Math.round(enabledTimes.at(-1)![1] / 2))
      newHistory.shift();
    history = newHistory;
  });
</script>

<CustomizationProvider />
{#each enabledTimes as time (time)}
  <div
    class="flex items-center gap-2"
    style="justify-content: {align === 'left'
      ? 'flex-start'
      : align === 'right'
        ? 'flex-end'
        : 'center'}"
  >
    {#if icon}
      <Hourglass />
    {/if}
    {#if text}
      <p>{time[0]}:</p>
    {/if}
    <Odometer
      value={calculateGain(history, time)}
      class="font-count text-2xl"
    />
  </div>
{/each}
