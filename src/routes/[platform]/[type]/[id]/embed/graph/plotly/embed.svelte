<script lang="ts">
  import CustomizationProvider from "../../customization-provider.svelte";
  import { getCustomization } from "../../customization.svelte";
  import { getEmbedState, isEmbed } from "../../state.svelte";
  import { untrack } from "svelte";

  const embedState = getEmbedState();
  const { countIndex, counts } = embedState;

  let chart: HTMLDivElement;

  $effect(() => {
    if (chart && isEmbed()) {
      chart.style.width = "100vw";
      chart.style.height = "100vh";
    }
  });

  const customization = getCustomization();

  function updateChart(history: [number, number][]) {
    if (!("Plotly" in window)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.Plotly as any).newPlot(
      chart,
      [
        {
          x: history.map((d) => d[0]),
          y: history.map((d) => d[1]),
          type: "line",
          marker: {
            opacity: 0,
          },
          line: {
            width: 4,
            color: $customization.graphColor,
          },
        },
      ],
      {
        autosize: true,
        xaxis: embedState.clean
          ? {
              visible: false,
            }
          : {
              showgrid: false,
            },
        yaxis: embedState.clean
          ? {
              visible: false,
            }
          : {
              automargin: true,
              autorange: true,
              showgrid: false,
            },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        margin: embedState.clean
          ? {
              t: 0,
              b: 0,
              l: 0,
              r: 0,
            }
          : undefined,
      },
      {
        displayModeBar: false,
      }
    );
  }

  let history = $state.raw<[number, number][]>([]);

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    embedState.clean;
    const unsub = customization.subscribe(() => {});

    updateChart(untrack(() => history));

    return () => unsub();
  });

  $effect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "resize",
      () => updateChart(untrack(() => history)),
      {
        signal: controller.signal,
      }
    );
    return () => controller.abort();
  });

  $effect(() => {
    const count = counts()[countIndex];
    if (!count) return;

    const newHistory: [number, number][] = [
      ...untrack(() => history),
      [Date.now(), count],
    ];
    if (newHistory.length >= 1800) newHistory.shift();
    history = newHistory;

    updateChart(newHistory);
  });
</script>

<CustomizationProvider />
<svelte:head>
  <script
    src="https://cdn.plot.ly/plotly-2.4.2.min.js"
    type="text/javascript"
  ></script>
</svelte:head>
<div bind:this={chart}></div>
