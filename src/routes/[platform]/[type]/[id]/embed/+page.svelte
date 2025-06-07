<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import type { PageProps } from "../$types";
  import {
    getEmbedState,
    setEmbedState,
    updateEmbedState,
  } from "./state.svelte";
  import Check from "@lucide/svelte/icons/check";
  import type { Component } from "svelte";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";
  import { queryParam, queryParameters } from "sveltekit-search-params";
  import { page } from "$app/state";
  import CustomizationDialog from "./customization-dialog.svelte";
  import { getGoal } from "$lib/utils";
  import { times } from "$lib/gains";

  import SmallEmbed from "./small/embed.svelte";
  import LargeEmbed from "./large/embed.svelte";
  import CountEmbed from "./count/embed.svelte";
  import AveragesEmbed from "./averages/embed.svelte";
  import GainsEmbed from "./gains/embed.svelte";
  import HighchartsGraphEmbed from "./graph/highcharts/embed.svelte";
  import ProgressEmbed from "./progress/embed.svelte";
  import PlotlyGraphEmbed from "./graph/plotly/embed.svelte";

  const query = queryParameters();

  type Embed = {
    component: Component;
    options?: ({
      id: string;
      name: string;
    } & (
      | {
          type: "checkboxes";
          options: string[];
          default: string[];
        }
      | {
          type: "checkbox";
          default: boolean;
        }
      | {
          options: string[];
          default: string;
        }
    ))[];
  };

  const embeds: Record<string, Embed> = {
    small: {
      component: SmallEmbed,
    },
    large: {
      component: LargeEmbed,
    },
    count: {
      component: CountEmbed,
      options: [
        {
          id: "size",
          name: "Size",
          options: ["small", "medium", "large", "extra-large"],
          default: "medium",
        },
        {
          id: "align",
          name: "Align",
          options: ["left", "center", "right"],
          default: "left",
        },
      ],
    },
    progress: {
      component: ProgressEmbed,
      options: [
        {
          id: "text",
          name: "Text",
          type: "checkbox",
          default: true,
        },
      ],
    },
    averages: {
      component: AveragesEmbed,
      options: [
        {
          id: "align",
          name: "Align",
          options: ["left", "center", "right"],
          default: "left",
        },
        {
          id: "times",
          name: "Times",
          type: "checkboxes",
          options: times.map((time) => time[0]),
          default: ["24h"],
        },
        {
          id: "icon",
          name: "Icon",
          type: "checkbox",
          default: true,
        },
        {
          id: "text",
          name: "Text",
          type: "checkbox",
          default: true,
        },
      ],
    },
    gains: {
      component: GainsEmbed,
      options: [
        {
          id: "align",
          name: "Align",
          options: ["left", "center", "right"],
          default: "left",
        },
        {
          id: "times",
          name: "Times",
          type: "checkboxes",
          options: times.map((time) => time[0]),
          default: ["24h"],
        },
        {
          id: "icon",
          name: "Icon",
          type: "checkbox",
          default: true,
        },
        {
          id: "text",
          name: "Text",
          type: "checkbox",
          default: true,
        },
      ],
    },
    "graph/highcharts": {
      component: HighchartsGraphEmbed,
      options: [
        {
          id: "clean",
          name: "Clean Mode",
          type: "checkbox",
          default: false,
        },
      ],
    },
    "graph/plotly": {
      component: PlotlyGraphEmbed,
      options: [
        {
          id: "clean",
          name: "Clean Mode",
          type: "checkbox",
          default: false,
        },
      ],
    },
  };

  let currentEmbedKey = queryParam("type", {
    encode: (value: string) => value,
    decode: (value: string | null) => value,
    defaultValue: Object.keys(embeds)[0],
  });
  const currentEmbed = $derived(embeds[$currentEmbedKey]);

  const goalCount = parseInt(page.url.searchParams.get("goal-count") ?? "0");

  const { data }: PageProps = $props();
  const { count, countIndex } = data;

  let embedWrapper: HTMLDivElement;
  let embedHeight = $state<number>(0);

  function capitalizeWord(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  function capitalize(inputString: string) {
    const words = inputString.split("-");
    const capitalizedWords = words.map(capitalizeWord).join(" ");

    const parts = capitalizedWords.split("/");
    if (parts.length !== 2) {
      return capitalizedWords; // Return original if not in expected format
    }

    const firstWord = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const secondWord = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);

    return `${firstWord} (${secondWord})`;
  }

  const embedUrl = $derived.by(() => {
    const embedState = getEmbedState();

    const params = new URLSearchParams();
    if (countIndex !== 0) {
      params.set("count", countIndex.toString());
    }

    if (currentEmbed.options) {
      for (const option of currentEmbed.options) {
        const value = embedState[option.id];
        if (typeof value !== "undefined" && value !== option.default)
          params.set(option.id, value);
      }
    }

    const obj = JSON.stringify(embedState.customization);
    if (obj !== "{}") params.set("customization", obj);

    return `${window.location.origin}/${data.count.platform}/${data.count.type}/${data.id}/embed/${$currentEmbedKey}${params.size > 0 ? `?${params}` : ""}`;
  });

  let hasCopied = $state(false);
  function copyUrl() {
    navigator.clipboard.writeText(embedUrl);
    hasCopied = true;
    setTimeout(() => {
      hasCopied = false;
    }, 1000);
  }

  let counts = $state.raw<number[]>([]);

  setEmbedState({
    ...$query,
    ...data,
    counts: () => counts,
    customization: {},
  });

  $effect(() => {
    const update = async () => {
      const newCounts = await data.count.getCounts(data.id);
      counts = [...newCounts, getGoal(newCounts[goalCount])];
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  });

  $effect(() => {
    embedHeight = embedWrapper.clientHeight;

    const observer = new MutationObserver(() => {
      embedHeight = embedWrapper.clientHeight;
    });
    observer.observe(embedWrapper, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  });
</script>

<svelte:head>
  <script
    src="https://cdn.plot.ly/plotly-2.4.2.min.js"
    type="text/javascript"
  ></script>
</svelte:head>
<div class="space-y-4">
  <div bind:this={embedWrapper} class="embed bg-background">
    <currentEmbed.component />
  </div>
  <Card class="space-y-2">
    <p class="font-semibold">Customized embed URL:</p>
    <div class="relative">
      <Input value={embedUrl} readonly class="w-full py-5" />
      <Button
        variant="outline"
        onclick={copyUrl}
        class="absolute right-1.5 bottom-[5px] h-8 w-[53.81px] cursor-pointer rounded-md px-3 text-xs"
      >
        {#if hasCopied}
          <Check class="size-4" />
        {:else}
          Copy
        {/if}
      </Button>
    </div>
    <p>
      <span class="font-semibold">Recommended height:</span>
      {embedHeight}
    </p>
  </Card>
  <Card class="space-y-4">
    <div class="space-y-2 text-center">
      <p class="font-semibold">Embed type</p>
      <RadioGroup.Root
        class="flex flex-wrap items-center justify-center gap-3"
        bind:value={$currentEmbedKey}
      >
        {#each Object.keys(embeds) as embed (embed)}
          <div class="flex items-center gap-2">
            <RadioGroup.Item id={`embed-${embed}`} value={embed} />
            <Label for={`embed-${embed}`}>{capitalize(embed)}</Label>
          </div>
        {/each}
      </RadioGroup.Root>
    </div>
    {#if currentEmbed.options}
      {#each currentEmbed.options as option (option.id)}
        {#if "type" in option}
          {#if option.type === "checkboxes"}
            <div class="space-y-2 text-center">
              <p class="font-semibold">{option.name}</p>
              <div class="flex flex-wrap items-center justify-center gap-3">
                {#each option.options as o (o)}
                  <div class="flex items-center gap-2">
                    <Checkbox
                      id="{option.id}-{o}"
                      checked={(
                        getEmbedState()[option.id] ??
                        $query[option.id] ??
                        option.default
                      ).includes(o)}
                      onCheckedChange={(v) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        let newValue: any = [
                          ...(getEmbedState()[option.id]?.split(",") ??
                            option.default),
                        ];
                        if (v) {
                          newValue.push(o);
                        } else {
                          newValue = newValue.filter((i: string) => i !== o);
                        }

                        newValue = newValue.join(",");

                        updateEmbedState((state) => {
                          state[option.id] = newValue;
                          return state;
                        });

                        $query[option.id] = newValue;
                      }}
                    />
                    <Label for="{option.id}-{o}">{capitalize(o)}</Label>
                  </div>
                {/each}
              </div>
            </div>
          {:else if option.type === "checkbox"}
            <div class="flex items-center justify-center gap-2">
              <Label for={option.id} class="text-base font-semibold"
                >{option.name}</Label
              >
              <Checkbox
                id={option.id}
                bind:checked={
                  () =>
                    getEmbedState()[option.id] ??
                    $query[option.id] ??
                    option.default,
                  (newValue) => {
                    updateEmbedState((state) => {
                      state[option.id] = newValue;
                      return state;
                    });

                    $query[option.id] = newValue;
                  }
                }
              />
            </div>
          {/if}
        {:else}
          <div class="space-y-2 text-center">
            <p class="font-semibold">{option.name}</p>
            <RadioGroup.Root
              class="flex flex-wrap items-center justify-center gap-3"
              bind:value={
                () =>
                  getEmbedState()[option.id] ??
                  $query[option.id] ??
                  option.default,
                (newValue) => {
                  updateEmbedState((state) => {
                    state[option.id] = newValue;
                    return state;
                  });

                  $query[option.id] = newValue;
                }
              }
            >
              {#each option.options as o (o)}
                <div class="flex items-center gap-2">
                  <RadioGroup.Item id={`${option.id}-${o}`} value={o} />
                  <Label for={`${option.id}-${o}`}>{capitalize(o)}</Label>
                </div>
              {/each}
            </RadioGroup.Root>
          </div>
        {/if}
      {/each}
    {/if}
  </Card>
  <div
    class="grid w-full grid-cols-1 justify-center gap-3 sm:grid-cols-2 lg:grid-cols-4"
  >
    {#snippet sideCount(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      c: any,
      index: number
    )}
      <button
        onclick={() => {
          if (index === countIndex) return;

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
          class="{index === countIndex
            ? 'bg-accent'
            : 'hover:bg-accent'} flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <div class="text-muted-foreground flex items-center gap-1.5 text-sm">
            <c.icon class="size-4" />
            {c.name}
          </div>
        </Card>
      </button>
    {/snippet}
    {#each count.counts.map((_, i) => ({ index: i })) as { index } (index)}
      {@render sideCount(count.counts[index], index)}
    {/each}
  </div>
  <div class="flex items-center justify-center">
    <CustomizationDialog class="!bg-card" />
  </div>
</div>
