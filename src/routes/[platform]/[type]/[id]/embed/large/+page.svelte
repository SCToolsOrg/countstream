<script lang="ts">
  import { page } from "$app/state";
  import { getGoal } from "$lib/utils";
  import { setEmbedState } from "../state.svelte";
  import type { PageProps } from "./$types";
  import Embed from "./embed.svelte";

  const { data }: PageProps = $props();

  let counts = $state.raw<number[]>([]);

  const goalCount = parseInt(page.url.searchParams.get("goal-count") ?? "0");

  const { url } = page;
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
