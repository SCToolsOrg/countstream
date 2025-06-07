<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import {
    getCustomization,
    getKey,
    setCustomizationStore,
  } from "$lib/customization.svelte";
  import { type Snippet } from "svelte";

  setCustomizationStore();

  const pageStore = setCustomizationStore("page");
  onNavigate((navigation) => {
    const { pathname } = navigation.to!.url;
    pageStore.key = "countstream:customization:" + getKey(pathname);
    pageStore.initializeData();
  });

  const customization = getCustomization();

  function stringifyStyles(
    styles: Record<string, string | number | undefined>
  ) {
    const arr = [];
    for (const [key, value] of Object.entries(styles)) {
      if (!value) continue;
      arr.push(`${arr.length > 0 ? "\n\t" : "\t"}${key}: ${value.toString()};`);
    }
    return arr.join("");
  }

  $effect(() => {
    const styleElem = document.createElement("style");
    styleElem.id = "countstream-customization";

    const styles = {
      "--font-sans": $customization.fontFamily,
      "--font-count": $customization.countFontFamily,
      "--font-count-weight": $customization.countFontWeight,
      "--count-line-height": $customization.countLineHeight,
      "--speed": `${$customization.odometerSpeed}s`,
      "--background": $customization.backgroundColor,
      "--card": $customization.cardColor,
      "--count-color": $customization.countColor,
      "--up-color": $customization.odometerUpColor,
      "--down-color": $customization.odometerDownColor,
    };
    styleElem.textContent = `:root {\n${stringifyStyles(styles)}\n}`;

    const mainElem = document.body.querySelector("main")!.parentElement!;
    mainElem.after(styleElem);

    const shouldTransition = $customization.animateOdometerColor;
    if (shouldTransition)
      document.body.classList.add("transition-odometer-colors");
    else document.body.classList.remove("transition-odometer-colors");

    return () => {
      document.getElementById("countstream-customization")?.remove();
    };
  });

  const { children }: { children: Snippet } = $props();
</script>

{@render children()}
