<script lang="ts">
  import {
    calculateGoal,
    calculateMilestones,
    calculateProgress,
  } from "$lib/goal";
  import CustomizationProvider from "../customization-provider.svelte";
  import { getEmbedState } from "../state.svelte";

  const embedState = getEmbedState();

  const { countIndex, counts } = embedState;

  const text = $derived(embedState.text ?? true);
  const milestones = $derived(calculateMilestones(counts()[countIndex]));
</script>

<CustomizationProvider />
<div
  class="h-1 bg-white transition-[width]"
  style="width: {calculateProgress(counts()[countIndex])}%"
></div>
{#if text}
  <div class="mt-0.5 flex justify-between text-sm">
    <p>
      {#if counts()[countIndex]}
        {milestones.currentMilestone.toLocaleString()}
      {:else}
        <!-- eslint-disable-next-line svelte/no-useless-mustaches -->
        {"‍"}
      {/if}
    </p>
    <p class="w-full text-right">
      {#if counts()[countIndex]}
        {milestones.nextMilestone.toLocaleString()}
      {:else}
        <!-- eslint-disable-next-line svelte/no-useless-mustaches -->
        {"‍"}
      {/if}
    </p>
  </div>
{/if}
