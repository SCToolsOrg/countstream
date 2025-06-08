<script lang="ts">
  import { page } from "$app/state";
  import { useCounts } from "../../counts.svelte";
  import { setEmbedState } from "../state.svelte";
  import type { PageProps } from "./$types";
  import Embed from "./embed.svelte";

  const { data }: PageProps = $props();

  const { url } = page;
  const text = (url.searchParams.get("text") ?? "true") === "true";

  const { counts } = useCounts(data.count, data.id);
  setEmbedState({
    ...data,
    counts: () => $counts,
    customization: url.searchParams.has("customization")
      ? JSON.parse(url.searchParams.get("customization")!)
      : undefined,
    text,
  });
</script>

<div class="embed">
  <Embed />
</div>
