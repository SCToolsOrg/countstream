<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<div class="border-b">
  <header class="mx-auto flex w-full max-w-7xl justify-between px-4 py-3">
    <a
      href="/"
      class="flex items-center gap-1 transition-opacity hover:opacity-75"
    >
      <h1 class="text-xl font-semibold">
        count<span class="text-primary">stream</span>
      </h1>
      <sub>by SCTools</sub>
    </a>
  </header>
</div>

<main class="mx-auto w-full p-4 md:w-[90%]">
  {@render children()}
</main>
