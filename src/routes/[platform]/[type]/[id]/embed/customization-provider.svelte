<script lang="ts">
  import { page } from "$app/state";
  import { getCustomization } from "./customization.svelte";

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
    const styles = {
      "--font-sans": $customization.fontFamily,
      "--font-count": $customization.countFontFamily,
      "--font-count-weight": $customization.countFontWeight,
      "--speed": `${$customization.odometerSpeed}s`,
      "--background": $customization.backgroundColor,
      "--card": $customization.cardColor,
      "--count-color": $customization.countColor,
      "--up-color": $customization.odometerUpColor,
      "--down-color": $customization.odometerDownColor,
    };

    if (page.url.pathname.split("/").at(-2) === "embed") {
      const observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList") {
            const [addedNode] = mutation.addedNodes;
            if (
              addedNode?.nodeName.toLowerCase() === "style" &&
              (addedNode as HTMLStyleElement).id === "countstream-customization"
            ) {
              document.getElementById(
                "countstream-customization"
              )!.textContent = `:root {\n${stringifyStyles(styles)}\n}`;
              observer.disconnect();
            }
          }
        }
      });

      observer.observe(document.body, { childList: true });
    } else {
      const styleElem = document.createElement("style");
      styleElem.id = "countstream-embed-customization";
      styleElem.textContent = `.embed {\n${stringifyStyles(styles)}\n}`;

      const mainElem = document.body.querySelector("main")!.parentElement!;
      mainElem.after(styleElem);
    }

    const shouldTransition = $customization.animateOdometerColor;
    if (shouldTransition)
      document.body.classList.add("transition-odometer-colors");
    else document.body.classList.remove("transition-odometer-colors");

    return () => {
      document.getElementById("countstream-embed-customization")?.remove();
    };
  });
</script>
