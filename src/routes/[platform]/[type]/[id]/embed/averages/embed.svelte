<script lang="ts">
  import Odometer from "$lib/components/odometer.svelte";
  import { untrack } from "svelte";
  import { getEmbedState } from "../state.svelte";
  import Hourglass from "@lucide/svelte/icons/hourglass";

  const times = [
    ["30s", 30],
    ["1m", 60],
    ["10m", 600],
    ["1h", 3600],
    ["6h", 21600],
    ["12h", 43200],
    ["24h", 86400],
  ] as const;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getCombn(arr: any[]) {
    var count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (isNaN(arr[i])) {
        arr.splice(i, 1);
      }
    }
    for (let i = 0; i < arr.length; i++) {
      //console.log(i)
      if (i == 0) {
        count = count + (arr[i] - parseFloat(arr[i]));
      } else {
        count = count + (parseFloat(arr[i]) - parseFloat(arr[i - 1]));
      }
    }
    return count;
  }

  function calculateAverage(time: (typeof times)[number]) {
    const average =
      getCombn(history) /
      history.length /
      Math.floor(parseFloat("2000") / 1000);

    const avg = Math.floor(average * time[1]);
    return isNaN(avg) ? 0 : avg;
  }

  const embedState = getEmbedState();
  const { countIndex, counts } = embedState;

  const enabledTimes = $derived(
    times.filter((t) => (embedState.times ?? "24h").includes(t[0]))
  );
  const align = $derived(embedState.align ?? "left");

  let history = $state.raw<number[]>([]);

  $effect(() => {
    const count = counts()[countIndex];

    const newHistory = [...untrack(() => history), count];
    if (newHistory.length >= 90) newHistory.shift();
    history = newHistory;
  });
</script>

{#each enabledTimes as time (time)}
  <div
    class="flex items-center gap-2"
    style="justify-content: {align === 'left'
      ? 'flex-start'
      : align === 'right'
        ? 'flex-end'
        : 'center'}"
  >
    {#if embedState.icon}
      <Hourglass />
    {/if}
    {#if embedState.text}
      <p>{time[0]}:</p>
    {/if}
    <Odometer
      value={calculateAverage(time)}
      class="font-count text-2xl !leading-[1.2em]"
    />
  </div>
{/each}
