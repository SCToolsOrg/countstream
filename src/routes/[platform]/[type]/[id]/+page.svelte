<script lang="ts">
  import { page } from "$app/state";
  import Odometer from "$lib/components/odometer.svelte";
  import { Card } from "$lib/components/ui/card";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();

  const { count, countIndex, id } = data;
  const currentCount = count.counts[countIndex];

  let counts = $state.raw<number[]>([]);

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

<div class="flex flex-col items-center gap-4">
  <Card class="flex w-full flex-col items-center justify-center text-center">
    {#await data.info}
      <Skeleton class="h-20 w-20 rounded-full" />
      <Skeleton class="mt-2 h-6 w-48 rounded-lg" />
      <Skeleton class="mt-1 h-5 w-32 rounded-lg" />
    {:then user}
      <img
        src={user.avatar}
        alt={user.name + " avatar"}
        class="h-20 w-20 rounded-full"
      />
      <h1 class="mt-2 text-2xl">{user.name}</h1>
      <p class="text-muted-foreground text-sm">{user.handle}</p>
    {/await}
    <Odometer
      class="font-count text-4xl !leading-[1.2em] sm:text-7xl xl:text-9xl"
      value={counts[countIndex]}
    />
    <div class="text-muted-foreground flex items-center gap-1.5 text-sm">
      <currentCount.icon class="h-4 w-4" />
      {currentCount.name}
    </div>
  </Card>
  <div
    class="grid w-full grid-cols-1 justify-center gap-2 sm:grid-cols-2 lg:grid-cols-4"
  >
    {#snippet sideCount(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      c: any,
      num: number,
      index: number
    )}
      <button
        onclick={() => {
          const newParams = new URLSearchParams(page.url.searchParams);
          if (index !== 0) newParams.set("count", index.toString());
          else newParams.delete("count");
          window.location.href =
            window.location.origin +
            page.url.pathname +
            (newParams.toString().length > 0 ? `?${newParams}` : "");
        }}
      >
        <Card
          class="hover:bg-accent flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <Odometer
            value={num}
            class="font-count text-2xl leading-[1.1em] 2xl:text-4xl"
          />
          <div class="text-muted-foreground flex items-center gap-1.5 text-sm">
            <c.icon class="h-4 w-4" />
            {c.name}
          </div>
        </Card>
      </button>
    {/snippet}
    {#each counts
      .map((c, i) => ({ num: c, index: i }))
      .filter((_, i) => i !== countIndex) as { num, index } (index)}
      {@render sideCount(count.counts[index], num, index)}
    {/each}
  </div>
</div>
