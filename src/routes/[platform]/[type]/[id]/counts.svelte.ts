import { page } from "$app/state";
import type { Count } from "$lib/counts";
import { calculateGoal } from "$lib/goal";
import { writable } from "svelte/store";

const jsalStatsChannels = [
  "UCrZKnWgOaYTTc7sc1KsVXZw",
  "UCUXNOmIdsoyd5fh5TZHHO5Q",
  "UCxLIJccyaRQDeyu6RzUsPuw",
  "UCd15dSPPT-EhTXekA7_UNAQ",
  "UCewMTclBJZPaNEfbf-qYMGA",
];

export function useCounts(
  count: Count,
  id: string,
  run?: (counts: number[]) => void
) {
  const counts = writable<number[]>([]);
  const goalCount = $derived(
    parseInt(page.url.searchParams.get("goal-count") ?? "0")
  );

  $effect(() => {
    const update = async () => {
      let newCounts = await count.getCounts(id);
      counts.set([...newCounts, calculateGoal(newCounts[goalCount])]);
      run?.(newCounts);
    };

    update();
    const interval = setInterval(update, 2000);
    return () => {
      clearInterval(interval);
      if (studioInterval) {
        clearInterval(studioInterval);
      }
    };
  });

  return {
    counts: {
      subscribe: counts.subscribe,
    },
    isStudio: {
      subscribe: isStudio.subscribe,
    },
  };
}
