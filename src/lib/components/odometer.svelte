<script lang="ts">
  import type { WithElementRef } from "$lib/utils";
  import type { HTMLAttributes } from "svelte/elements";
  import { onMount } from "svelte";

  interface OdometerProps
    extends WithElementRef<HTMLAttributes<HTMLDivElement>> {
    /**
     * Count is a simpler animation method which just increments the value, use it when you're looking for something more
     * subtle.
     */
    animation?: "count";
    /**
     * Change how long the javascript expects the CSS animation to take.
     * @default 2000
     */
    duration?: number;
    /**
     * Change how digit groups are formatted, and how many digits are shown after the decimal point.
     * (,ddd)    -  12,345,678
     * (,ddd).dd -  12,345,678.09
     * (.ddd),dd -  12.345.678,09
     * ( ddd),dd -  12 345 678,09
     * d         -  12345678
     */
    format?: string;
    /**
     * Specify the theme (if you have more than one theme css file on the page).
     * Will add CSS class .odometer-theme-{prop value} to wrapper `div`.
     */
    theme?: string;
    /**
     * Current value. Change it to run animation.
     */
    value: number;
  }

  let node: HTMLDivElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let odometer: any;
  const { animation, duration, format, theme, value, ...rest }: OdometerProps =
    $props();

  onMount(async () => {
    // @ts-expect-error no @types package
    const Odometer = await import("odometer").then((x) => x.default);
    odometer = new Odometer({
      el: node,
      auto: false,
      animation,
      duration,
      format,
      theme,
      value,
    });
  });

  $effect(() => {
    // sometimes you just need to force track something...
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    value;

    odometer?.update(value);
  });
</script>

<div {...rest} bind:this={node}>{value}</div>
