<script lang="ts">
  import { page } from "$app/state";
  import Odometer from "$lib/components/odometer.svelte";
  import { Card } from "$lib/components/ui/card";
  import Highcharts from "highcharts";
  import Chart from "@highcharts/svelte";
  import type { PageProps } from "./$types";
  import { graphOptions } from "$lib/graph-options";
  import { CustomizationDialog } from "$lib/components/customization";
  import { getCustomization } from "$lib/customization.svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import AppWindow from "@lucide/svelte/icons/app-window";
  import PartyPopper from "@lucide/svelte/icons/party-popper";
  import { getGoal } from "$lib/utils";

  const { data }: PageProps = $props();

  const { count, countIndex, info, id } = data;

  const goalCount = parseInt(page.url.searchParams.get("goal-count") ?? "0");

  const currentCount = count.counts[countIndex];

  // svelte-ignore non_reactive_update
  let chart: Highcharts.Chart;
  let counts = $state.raw<number[]>([]);

  $effect(() => {
    const update = async () => {
      const newCounts = await count.getCounts(id);
      counts = [...newCounts, getGoal(newCounts[goalCount])];

      if (chart) {
        if (chart.series[0].points.length >= 1800)
          chart.series[0].data[0].remove();
        chart.series[0].addPoint([Date.now(), Number(counts[countIndex])]);
      }
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  });

  const customization = getCustomization();
</script>

<div class="flex flex-col items-center gap-3">
  <Card class="flex w-full flex-col items-center justify-center text-center">
    {#if $customization.banner && info.banner}
      <img
        src={info.banner}
        alt={info.name + " banner"}
        class="roundeed-lg mb-4 h-[150px] w-full object-cover"
      />
    {/if}
    {#if $customization.avatar}
      <img
        src={info.avatar}
        alt={info.name + " avatar"}
        class="mb-2 h-20 w-20 rounded-full"
      />
    {/if}
    {#if $customization.name}
      <h1 class="text-2xl">{info.name}</h1>
    {/if}
    {#if $customization.username}
      <p class="text-muted-foreground text-sm">{info.username}</p>
    {/if}
    <Odometer
      class="font-count text-4xl sm:text-7xl xl:text-9xl"
      value={counts[countIndex]}
    />
    {#if $customization.countName || $customization.countIcon}
      <div class="text-muted-foreground flex items-center gap-1.5 text-sm">
        {#if $customization.countIcon}
          <currentCount.icon class="h-4 w-4" />
        {/if}
        {#if $customization.countName}
          {currentCount.name}
        {/if}
      </div>
    {/if}
  </Card>
  {#if $customization.sideCounts}
    <div
      class="grid w-full grid-cols-1 justify-center gap-3 sm:grid-cols-2 lg:grid-cols-4"
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
            {#if $customization.countName || $customization.countIcon}
              <div
                class="text-muted-foreground flex items-center gap-1.5 text-sm"
              >
                {#if $customization.countIcon}
                  <c.icon class="size-4" />
                {/if}
                {#if $customization.countName}
                  {c.name}
                {/if}
              </div>
            {/if}
          </Card>
        </button>
      {/snippet}
      {#each count.counts
        .map((_, i) => ({ num: counts[i] ?? 0, index: i }))
        .filter((_, i) => i !== countIndex) as { num, index } (index)}
        {@render sideCount(count.counts[index], num, index)}
      {/each}
    </div>
  {/if}
  <Card
    class="w-full"
    style={!$customization.graph ? "display: none" : undefined}
  >
    <Chart
      highcharts={Highcharts}
      options={graphOptions(info.name)}
      bind:chart
    />
  </Card>
  <div class="flex items-center gap-2">
    <CustomizationDialog class="!bg-card" />
    <a
      href="/{count.platform}/{count.type}/{id}/embed"
      class={buttonVariants({
        class: "!bg-card",
        variant: "outline",
      })}
    >
      <AppWindow class="size-4" />
      Embed
    </a>
  </div>
</div>
