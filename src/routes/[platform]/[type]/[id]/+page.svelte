<script lang="ts">
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
      class="font-count text-5xl !leading-[1.2em] sm:text-7xl xl:text-9xl"
      value={counts[countIndex]}
    />
    <div class="text-muted-foreground flex items-center gap-1.5 text-sm">
      <currentCount.icon class="h-4 w-4" />
      {currentCount.name}
    </div>
  </Card>
</div>
