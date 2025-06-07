<script lang="ts">
  import CustomizationProvider from "../customization-provider.svelte";
  import { getEmbedState } from "../state.svelte";

  const embedState = getEmbedState();

  const calculateGoal = (num: number, amount: number) => {
    return Math.floor(num / amount) * amount + amount;
  };

  const calculateProgress = (count: number) =>
    ((100000 - (calculateGoal(count, 100000) - count)) / 100000) * 100;

  const { countIndex, counts } = embedState;

  const text = $derived(embedState.text ?? true);
</script>

<CustomizationProvider />
<div
  class="h-1 bg-white"
  style="width: {calculateProgress(counts()[countIndex])}%"
></div>
{#if text}
  <div class="mt-0.5 flex justify-between text-sm">
    <p>
      {(Math.floor(counts()[countIndex] / 100_000) * 100_000).toLocaleString()}
    </p>
    <p class="w-full text-right">
      {calculateGoal(counts()[countIndex], 100_000).toLocaleString()}
    </p>
  </div>
{/if}
