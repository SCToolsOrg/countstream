<script lang="ts">
  import { page } from "$app/state";
  import { calculateGoal } from "$lib/goal";
  import { setEmbedState } from "../state.svelte";
  import type { PageProps } from "./$types";
  import Embed from "./embed.svelte";

  const { data }: PageProps = $props();

  const { url } = page;
  const size = url.searchParams.get("size") ?? "medium";
  const align = url.searchParams.get("align") ?? "left";

  const goalCount = parseInt(page.url.searchParams.get("goal-count") ?? "0");

  let counts = $state.raw<number[]>([]);
  setEmbedState({
    ...data,
    counts: () => counts,
    customization: url.searchParams.has("customization")
      ? JSON.parse(url.searchParams.get("customization")!)
      : undefined,
    size,
    align,
  });

  const { count, id } = data;
  $effect(() => {
    const update = async () => {
      const newCounts = await count.getCounts(id);
      counts = [...newCounts, calculateGoal(newCounts[goalCount])];
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  });
</script>

<div class="embed">
  <Embed />
</div>
