<script lang="ts">
  import { page } from "$app/state";
  import { setEmbedState } from "../state.svelte";
  import type { PageProps } from "./$types";
  import Embed from "./embed.svelte";

  const { url } = page;
  const { data }: PageProps = $props();

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
      counts = newCounts;
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  });
</script>

<Embed />
