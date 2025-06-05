<script lang="ts">
  import "@fontsource-variable/dm-sans";
  import "@fontsource-variable/roboto";
  import "../app.css";
  import "../odometer.css";

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { CustomizationProvider } from "$lib/components/customization";
  import { page } from "$app/state";

  const queryClient = new QueryClient();

  let { children } = $props();

  const isEmbed = $derived.by(() => {
    const split = page.url.pathname.split("/");
    return !page.error && split.at(-2) === "embed";
  });
</script>

<QueryClientProvider client={queryClient}>
  <CustomizationProvider>
    {#if !isEmbed}
      <div class="border-b">
        <header class="mx-auto flex w-full max-w-7xl justify-between px-4 py-3">
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
    <main class={!isEmbed ? "mx-auto w-full p-4 md:w-[90%]" : ""}>
      {@render children()}
    </main>
  </CustomizationProvider>
</QueryClientProvider>
