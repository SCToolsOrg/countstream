<script lang="ts">
  import "@fontsource-variable/dm-sans";
  import "@fontsource-variable/roboto";
  import "../app.css";
  import "../odometer.css";

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { CustomizationProvider } from "$lib/components/customization";
  import Info from "@lucide/svelte/icons/info";
  import {
    isEmbed,
    setIsEmbed,
  } from "./[platform]/[type]/[id]/embed/state.svelte";
  import { page } from "$app/state";

  const queryClient = new QueryClient();

  let { children } = $props();

  $effect(() => {
    const split = page.url.pathname.split("/");
    setIsEmbed(
      !page.error && (split.at(-2) === "embed" || split.at(-3) === "embed")
    );
  });
</script>

<QueryClientProvider client={queryClient}>
  <CustomizationProvider>
    {#if !isEmbed()}
      <div class="border-b">
        <header
          class="mx-auto flex w-full justify-between px-4 py-3 md:w-[90%]"
        >
          <a
            href="/"
            class="flex items-center gap-1 transition-opacity hover:opacity-75"
          >
            <h1 class="text-xl font-semibold">
              count<span class="text-primary">stream</span>
            </h1>
            <sub class="text-muted-foreground">by SCTools</sub>
          </a>
        </header>
      </div>
    {/if}
    <main class={!isEmbed() ? "mx-auto w-full p-4 md:w-[90%]" : ""}>
      {#if !isEmbed()}
        <div
          class="mb-4 rounded-lg border border-yellow-300 bg-yellow-700/50 px-3 pt-3 pb-2 text-center text-sm text-yellow-300"
        >
          <Info class="mr-1.5 mb-1 inline size-4" />
          CountStream is currently in beta. Expect some bugs and missing features.
        </div>
      {/if}
      {@render children()}
    </main>
  </CustomizationProvider>
</QueryClientProvider>
