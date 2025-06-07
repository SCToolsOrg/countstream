<script lang="ts">
  import { getEmbedState, isEmbed } from "../../state.svelte";
  import Highcharts from "highcharts";
  import Chart from "@highcharts/svelte";
  import { graphOptions } from "$lib/graph-options";
  import CustomizationProvider from "../../customization-provider.svelte";

  const embedState = getEmbedState();
  const { countIndex, counts, info } = embedState;

  const options = graphOptions(info.name);
  const customOptions = $derived({
    ...options,
    xAxis: {
      ...options.xAxis,
      visible: !embedState.clean,
    },
    yAxis: {
      ...options.yAxis,
      visible: !embedState.clean,
    },
    credits: {
      ...options.credits,
      enabled: !embedState.clean,
    },
  });

  // svelte-ignore non_reactive_update
  let chart: Highcharts.Chart;

  $effect(() => {
    if (chart) {
      chart.update(customOptions);
      chart.redraw();
      chart.reflow();
    }
  });

  $effect(() => {
    if (chart && isEmbed()) {
      chart.container.parentElement!.style.width = "100vw";
      chart.container.parentElement!.style.height = "100vh";
    }
  });

  $effect(() => {
    const count = counts()[countIndex];
    if (!count) return;

    if (chart) {
      if (chart.series[0].points.length >= 1800)
        chart.series[0].data[0].remove();
      chart.series[0].addPoint([Date.now(), Number(count)]);
    }
  });
</script>

<CustomizationProvider />
<Chart highcharts={Highcharts} options={customOptions} bind:chart />
