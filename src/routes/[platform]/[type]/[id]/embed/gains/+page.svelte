<script lang="ts">
  import { page } from "$app/state";
  import { useCounts } from "../../counts.svelte";
  import { setEmbedState } from "../state.svelte";
  import type { PageProps } from "./$types";
  import Embed from "./embed.svelte";

  const { data }: PageProps = $props();

  const { url } = page;
  const times = url.searchParams.get("times") ?? "24h";
  const align = url.searchParams.get("align") ?? "left";
  const icon = (url.searchParams.get("icon") ?? "true") === "true";
  const text = (url.searchParams.get("icon") ?? "true") === "true";

  const { counts } = useCounts(data.count, data.id);
  setEmbedState({
    ...data,
    counts: () => $counts,
    customization: url.searchParams.has("customization")
      ? JSON.parse(url.searchParams.get("customization")!)
      : undefined,
    align,
    times,
    icon,
    text,
  });
</script>

<Embed />
