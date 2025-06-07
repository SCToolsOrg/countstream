<script lang="ts">
  import { createMutation } from "@tanstack/svelte-query";
  import type { PageProps } from "./$types";
  import { Card } from "$lib/components/ui/card";
  import Loader2 from "@lucide/svelte/icons/loader-2";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { convertPlatformToName } from "$lib/counts";

  const { data: count }: PageProps = $props();

  const search = createMutation({
    mutationKey: ["search", count.platform, count.type],
    mutationFn: async (query: string) => {
      if (!query) throw new Error("Missing query");

      const data = await count.search(query);
      if (!data?.length) throw new Error("No results found");

      return data;
    },
  });
</script>

<div class="space-y-4">
  <Card
    class="flex flex-col items-center justify-center gap-4 overflow-hidden text-center"
  >
    <div class="flex flex-col items-center justify-center gap-1.5 text-center">
      <img
        src={count.icon}
        alt={count.platform}
        width={64}
        height={64}
        class="z-50 h-16 object-contain"
      />
      <h1 class="text-3xl font-bold tracking-tight">{count.name}</h1>
    </div>
    <form
      onsubmit={(ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.currentTarget);
        $search.mutate(formData.get("query") as string);
      }}
      class="flex w-full items-center gap-3 lg:w-2/3"
    >
      <Input
        name="query"
        placeholder="Search for a {convertPlatformToName(
          count.platform
        )} {count.type}..."
      />
      <Button type="submit" disabled={$search.isPending}>Search</Button>
    </form>
  </Card>
  {#if $search.isPending}
    <Loader2 class="mx-auto h-16 w-16 animate-spin" />
  {:else if $search.isError}
    <div class="bg-destructive px-3 py-2 text-white dark:text-black">
      {$search.error.message}
    </div>
  {:else if $search.isSuccess}
    <div class="mx-auto flex w-full max-w-xl flex-col gap-4 text-center">
      {#each $search.data as item (item.id)}
        <a href={`/${count.platform}/${count.type}/${item.id}`}>
          <Card
            class="hover:bg-accent flex items-center gap-3 transition-colors"
          >
            <img
              src={item.avatar}
              alt={item.name}
              width={56}
              height={56}
              class="size-14 rounded-full object-cover"
            />
            <p class="truncate text-2xl font-semibold">{item.name}</p>
          </Card>
        </a>
      {/each}
    </div>
  {/if}
</div>
