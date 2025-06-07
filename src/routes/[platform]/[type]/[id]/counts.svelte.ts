import { page } from "$app/state";
import type { Count } from "$lib/counts";
import { calculateGoal } from "$lib/goal";
import { writable } from "svelte/store";

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
      const newCounts = await count.getCounts(id);
      counts.set([...newCounts, calculateGoal(newCounts[goalCount])]);
      run?.(newCounts);
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  });

  return {
    subscribe: counts.subscribe,
  };
}
