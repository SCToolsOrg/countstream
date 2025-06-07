<script lang="ts">
  import { page } from "$app/state";
  import { getGoal } from "$lib/utils";
  import { setEmbedState } from "../state.svelte";
  import type { PageProps } from "./$types";
  import Embed from "./embed.svelte";

  const { url } = page;
  const { data }: PageProps = $props();

  const goalCount = parseInt(url.searchParams.get("goal-count") ?? "0");

  let counts = $state.raw<number[]>([]);
  setEmbedState({
    ...data,
    counts: () => counts,
    customization: url.searchParams.has("customization")
      ? JSON.parse(url.searchParams.get("customization")!)
      : undefined,
  });

  const { count, id } = data;
  $effect(() => {
    const update = async () => {
      const newCounts = await count.getCounts(id);
      counts = [...newCounts, getGoal(newCounts[goalCount])];
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  });
</script>

<Embed />
