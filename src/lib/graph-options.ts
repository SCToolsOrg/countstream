import Highcharts, { Options } from "highcharts";
import colors from "tailwindcss/colors";

export const graphOptions = (name: string): Options => ({
  chart: {
    renderTo: "chart",
    type: "line",
    backgroundColor: "transparent",
    plotBorderColor: "transparent",
    animation: false,
  },
  title: {
    text: "",
  },
  xAxis: {
    type: "datetime",
    tickPixelInterval: 500,
    labels: {
      style: {
        color: "#858585",
      },
    },
    gridLineColor: "#858585",
    lineColor: "#858585",
    minorGridLineColor: "#858585",
    tickColor: "#858585",
    title: {
      style: {
        color: "#858585",
      },
    },
  },
  yAxis: {
    title: {
      text: "",
    },
    labels: {
      style: {
        color: "#858585",
      },
    },
    gridLineColor: "#858585",
    lineColor: "#858585",
    minorGridLineColor: "#858585",
    tickColor: "#858585",
  },
  credits: {
    enabled: true,
    text: "CountStream by SCTools",
    href: "/",
  },
  tooltip: {
    shared: true,
    formatter: function () {
      // @ts-expect-error runs on client
      const index = this.points[0].series.data.findIndex((p) => p.x === this.x);
      // @ts-expect-error runs on client
      const lastY = this.points[0].series.data[index - 1]?.y;
      // @ts-expect-error runs on client
      const dif = this.y - lastY;
      let r =
        // @ts-expect-error runs on client
        Highcharts.dateFormat("%A %b %e, %H:%M:%S", new Date(this.x)) +
        '<br><span style="color:black">\u25CF </span>' +
        // @ts-expect-error runs on client
        this.points[0].series.name +
        ": <b>" +
        // @ts-expect-error runs on client
        Highcharts.numberFormat(this.y, 0);
      if (dif < 0) {
        r +=
          '<span style="color:#ff0000;font-weight:bold;"> (' +
          Highcharts.numberFormat(dif, 0) +
          ")</span>";
      }
      if (dif > 0) {
        r +=
          '<span style="color:#00bb00;font-weight:bold;"> (+' +
          Highcharts.numberFormat(dif, 0) +
          ")</span>";
      }
      return r;
    },
  },
  series: [
    {
      showInLegend: false,
      marker: { enabled: false },
      color: colors.purple[500],
      lineWidth: 3,
      type: "line",
      name,
    },
  ],
});
