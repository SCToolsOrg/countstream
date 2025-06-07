<script lang="ts">
  import { page } from "$app/state";
  import { getGoal } from "$lib/utils";
  import { setEmbedState } from "../state.svelte";
  import type { PageProps } from "./$types";
  import Embed from "./embed.svelte";

  const { data }: PageProps = $props();

  const { url } = page;
  const times = url.searchParams.get("times") ?? "24h";
  const align = url.searchParams.get("align") ?? "left";
  const icon = (url.searchParams.get("icon") ?? "true") === "true";
  const text = (url.searchParams.get("icon") ?? "true") === "true";
  const goalCount = parseInt(url.searchParams.get("goal-count") ?? "0");

  let counts = $state.raw<number[]>([]);
  setEmbedState({
    ...data,
    counts: () => counts,
    customization: url.searchParams.has("customization")
      ? JSON.parse(url.searchParams.get("customization")!)
      : undefined,
    align,
    times,
    icon,
    text,
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
