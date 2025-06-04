<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<div class="bg-accent">
  <header class="mx-auto flex w-full max-w-7xl justify-between px-4 py-3">
    <a href="/" class="flex items-center gap-1">
      <h1 class="text-xl font-semibold">
        count<span class="text-primary">stream</span>
      </h1>
      <sub>by SCTools</sub>
    </a>
  </header>
</div>

<main>
  {@render children()}
</main>
