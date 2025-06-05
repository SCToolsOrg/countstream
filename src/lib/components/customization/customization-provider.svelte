<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import {
    getCustomization,
    getKey,
    setCustomizationStore,
  } from "$lib/customization.svelte";
  import { tick, type Snippet } from "svelte";

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
    const arr = ["{"];
    for (const [key, value] of Object.entries(styles)) {
      if (!value) continue;
      arr.push(`${key}: ${value.toString()};`);
    }
    arr.push("}");
    return arr.join("");
  }

  $effect(() => {
    const styleElement = document.createElement("style");
    styleElement.id = "111counts-customization";

    const styles = {
      "--font-text": $customization.fontFamily,
      "--font-count": $customization.countFontFamily,
      "--font-count-weight": $customization.countFontWeight,
      "--speed": `${$customization.odometerSpeed}s`,
      "--background": $customization.backgroundColor,
      "--card": $customization.cardColor,
      "--count-color": $customization.countColor,
      "--up-color": $customization.odometerUpColor,
      "--down-color": $customization.odometerDownColor,
    };
    styleElement.textContent = `:root ${stringifyStyles(styles)}`;

    document.head.appendChild(styleElement);

    const shouldTransition = $customization.animateOdometerColor;
    if (shouldTransition)
      document.body.classList.add("transition-odometer-colors");
    else document.body.classList.remove("transition-odometer-colors");

    return () => {
      tick().then(() => {
        document.getElementById("111counts-customization")?.remove();
      });
    };
  });

  const { children }: { children: Snippet } = $props();
</script>

{@render children()}
