import { useParams } from "react-router";
import Odometer from "react-odometerjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Eye, Goal, Info, Users } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { FC, useMemo, useRef } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Highcharts from "highcharts";
import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import { graphOptions } from "@/lib/graph-options";
import { apis, useLiveUser, useRecommendedApi } from "@/hooks/use-user";
import ApiDropdown from "@/components/api-dropdown";

interface Count {
  id: string;
  name: string;
  icon: FC;
}

const countList = [
  {
    id: "subscribers",
    name: "Subscribers",
    icon: Users,
  },
  {
    id: "views",
    name: "Views",
    icon: Eye,
  },
  {
    id: "videos",
    name: "Videos",
    icon: Camera,
  },
] satisfies Count[];

// TODO: support multiple platforms
export default function User() {
  const { id } = useParams();
  if (!id) throw new Error("Invalid state?");

  const recommendedApi = useRecommendedApi(id);

  const [api, setApi] = useQueryState(
    "api",
    parseAsStringEnum(apis.map((api) => api.id)).withDefault(recommendedApi),
  );
  const selectedApi = apis.find((a) => a.id === api) ?? apis[0];

  const [count, setCount] = useQueryState(
    "count",
    parseAsStringEnum(countList.map((c) => c.id)).withDefault("subscribers"),
  );
  const currentCount = countList.find((c) => c.id === count) ?? countList[0];

  const chartRef = useRef<HighchartsReactRefObject>(null);

  const { user, isLoading, counts } = useLiveUser({
    id,
    api: selectedApi,
    onRequest: (data) => {
      if (!chartRef.current) return data;
      if (chartRef.current.chart.series[0].points.length >= 3600)
        chartRef.current.chart.series[0].data[0].remove();
      chartRef.current?.chart.series[0].addPoint([
        Date.now(),
        Number(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any)?.[currentCount.id],
        ),
      ]);
    },
  });

  function getGoal(count: string | number) {
    count = parseFloat(count.toString());
    if (10 > count) return 10 - count;
    const e = "" + count;
    return Math.abs(
      count -
        (e.length > 6
          ? 1e6 * (Math.floor(count / 1e6) + 1)
          : (parseInt(e.charAt(0)) + 1) * Math.pow(10, e.length - 1)),
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col items-center gap-4">
      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-600 flex flex-col items-center justify-center text-center w-full">
        {isLoading ? (
          <>
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="mt-2 h-6 rounded-lg w-48" />
            <Skeleton className="mt-1 h-5 rounded-lg w-32" />
          </>
        ) : (
          <>
            <img
              src={user.avatar}
              alt={user.name + " avatar"}
              className="w-20 h-20 rounded-full"
            />
            <h1 className="mt-2 text-2xl">{user.title}</h1>
            <p className="text-sm text-zinc-400">{user.handle}</p>
          </>
        )}
        <Odometer
          className="text-5xl sm:text-7xl xl:text-9xl !leading-[1.2em]"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={(counts as any)?.[currentCount.id] ?? 0}
        />
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <currentCount.icon className="w-4 h-4" />
          {currentCount.name}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {countList
          .filter((c) => c.id !== count)
          .map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCount(c.id);
              }}
              className="@container bg-zinc-900 border border-zinc-600 p-4 rounded-lg flex flex-col items-center justify-center gap-1 text-center"
            >
              <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                <c.icon className="w-4 h-4" />
                {c.name}
              </div>
              <Odometer
                className="text-3xl @md:text-4xl !leading-[1.2em]"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={(counts as any)?.[c.id] ?? 0}
              />
            </button>
          ))}
        <div className="@container bg-zinc-900 border border-zinc-600 p-4 rounded-lg flex flex-col items-center justify-center gap-1 text-center">
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <Goal className="w-4 h-4" />
            Goal
          </div>
          <Odometer
            className="text-3xl @md:text-4xl !leading-[1.2em]"
            value={getGoal(counts?.subscribers ?? 0)}
          />
        </div>
      </div>
      <div className="bg-zinc-900 border border-zinc-600 p-4 py-6 rounded-lg w-full">
        <HighchartsReact
          highcharts={Highcharts}
          options={graphOptions(user?.title ?? "")}
          ref={chartRef}
        />
      </div>
      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-600 space-y-2">
        <div className="flex items-center justify-center text-center gap-1.5">
          <h1 className="font-semibold">Select an API:</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                <Info className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent className="bg-card text-foreground border max-w-sm text-center">
                The APIs listed here allow you to pick between different
                estimations. Some are more accurate and stable than others.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ApiDropdown
          name={user?.title ?? ""}
          selectedApi={selectedApi}
          setApi={setApi}
          recommendedApi={recommendedApi}
        />
      </div>
    </div>
  );
}
