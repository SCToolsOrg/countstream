<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();

  let counts = $state.raw<number[]>([]);

  $effect(() => {
    const update = async () => {
      const newCounts = await data.count.getCounts(data.id);
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
  </Card>
  {counts[0]}
</div>
