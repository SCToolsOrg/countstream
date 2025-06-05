<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import type { PageProps } from "../$types";
  import SmallEmbed from "./small/embed.svelte";
  import LargeEmbed from "./large/embed.svelte";
  import CountEmbed from "./count/embed.svelte";
  import {
    getEmbedState,
    setEmbedState,
    updateEmbedState,
  } from "./state.svelte";
  import Check from "@lucide/svelte/icons/check";
  import type { Component } from "svelte";
  import { page } from "$app/state";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import { goto } from "$app/navigation";

  const url = page.url;

  type Embed = {
    component: Component;
    options?: ({
      id: string;
      name: string;
    } & (
      | {
          type: "checkboxes";
          options: string[];
          default: string;
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
  };

  let currentEmbedKey = $state(
    url.searchParams.get("embed") ?? Object.keys(embeds)[0]
  );
  const currentEmbed = $derived(embeds[currentEmbedKey]);

  const { data }: PageProps = $props();

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
    const params = new URLSearchParams();
    if (currentEmbed.options) {
      for (const option of currentEmbed.options) {
        const value = getEmbedState()[option.id];
        if (typeof value !== "undefined" && value !== option.default)
          params.set(option.id, value);
      }
    }

    return `${window.location.origin}/${data.count.platform}/${data.count.type}/${data.id}/embed/${currentEmbedKey}${params.size > 0 ? `?${params}` : ""}`;
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
    ...data,
    counts: () => counts,
  });

  $effect(() => {
    const update = async () => {
      const newCounts = await data.count.getCounts(data.id);
      counts = newCounts;
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  });

  function createNewParams(key: string, value: string, defaultValue: string) {
    const newParams = new URLSearchParams(url.searchParams);
    if (value !== defaultValue) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    return newParams;
  }

  $effect(() => {
    const newParams = createNewParams(
      "type",
      currentEmbedKey,
      Object.keys(embeds)[0]
    );
    goto(
      `/${data.count.platform}/${data.count.type}/${data.id}/embed${newParams.size > 0 ? `?${newParams}` : ""}`
    );
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

<div class="space-y-4">
  <div bind:this={embedWrapper}>
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
        bind:value={currentEmbedKey}
      >
        {#each Object.keys(embeds) as embed (embed)}
          <div class="flex items-center gap-2">
            <RadioGroup.Item id={`embed-${embed}`} value={embed} />
            <label for={`embed-${embed}`}>{capitalize(embed)}</label>
          </div>
        {/each}
      </RadioGroup.Root>
    </div>
    {#if currentEmbed.options}
      {#each currentEmbed.options as option (option.id)}
        {#if "type" in option}{:else}
          <div class="space-y-2 text-center">
            <p class="font-semibold">{option.name}</p>
            <RadioGroup.Root
              class="flex flex-wrap items-center justify-center gap-3"
              bind:value={
                () =>
                  getEmbedState()[option.id] ??
                  url.searchParams.get(option.id) ??
                  option.default,
                (newValue) => {
                  updateEmbedState((state) => {
                    state[option.id] = newValue;
                    return state;
                  });

                  const newParams = createNewParams(
                    option.id,
                    newValue,
                    option.default
                  );
                  goto(
                    `/${data.count.platform}/${data.count.type}/${data.id}/embed${newParams.size > 0 ? `?${newParams}` : ""}`
                  );
                }
              }
            >
              {#each option.options as o (o)}
                <div class="flex items-center gap-2">
                  <RadioGroup.Item id={`${option.id}-${o}`} value={o} />
                  <label for={`${option.id}-${o}`}>{capitalize(o)}</label>
                </div>
              {/each}
            </RadioGroup.Root>
          </div>
        {/if}
      {/each}
    {/if}
  </Card>
</div>
