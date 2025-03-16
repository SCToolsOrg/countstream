import { apis, useLiveUser, useRecommendedApi } from "@/hooks/use-user";
import { useParams } from "react-router";
import { useEmbedState } from "./state";
import { useEffect, useRef } from "react";
import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import Highcharts from "highcharts";
import { graphOptions } from "@/lib/graph-options";

export default function GraphEmbed() {
  const { id } = useParams();
  if (!id) throw new Error("Invalid state?");

  const recommendedApi = useRecommendedApi(id);

  const api = useEmbedState("api", recommendedApi);
  const selectedApi = apis.find((a) => a.id === api) ?? apis[0];
  const count = useEmbedState("count", "subscribers");

  const chartRef = useRef<HighchartsReactRefObject>(null);

  const { user } = useLiveUser({
    id,
    api: selectedApi,
    onRequest: (data) => {
      if (!chartRef.current) return;
      if (chartRef.current.chart.series[0].points.length >= 3600)
        chartRef.current.chart.series[0].data[0].remove();
      chartRef.current?.chart.series[0].addPoint([
        Date.now(),
        Number((data as any)?.[count]),
      ]);
    },
  });

  useEffect(() => {
    const container = chartRef.current!.container.current!;
    container.style.width = "100%";
    chartRef.current!.chart.reflow();
  }, [chartRef]);

  return (
    <div className="flex h-screen">
      <HighchartsReact
        highcharts={Highcharts}
        options={graphOptions(user?.title ?? "")}
        ref={chartRef}
      />
    </div>
  );
}
