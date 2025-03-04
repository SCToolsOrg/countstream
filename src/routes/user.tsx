import { Link, useParams, useSearchParams } from "react-router";
import Odometer from "react-odometerjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Eye, Goal, Info, Users } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { FC, useRef } from "react";
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
import { Card } from "@/components/ui/card";

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
  const [searchParams] = useSearchParams();

  if (!id) throw new Error("Invalid state?");

  const recommendedApi = useRecommendedApi(id);

  const [api, setApi] = useQueryState(
    "api",
    parseAsStringEnum(apis.map((api) => api.id)).withDefault(recommendedApi),
  );
  const selectedApi = apis.find((a) => a.id === api) ?? apis[0];

  const count = searchParams.get("count") ?? countList[0].id;
  const currentCount = countList.find((c) => c.id === count) ?? countList[0];

  const chartRef = useRef<HighchartsReactRefObject>(null);

  const { user, isLoading, counts } = useLiveUser({
    id,
    api: selectedApi,
    onRequest: (data) => {
      if (!chartRef.current) return;
      if (chartRef.current.chart.series[0].points.length >= 3600)
        chartRef.current.chart.series[0].data[0].remove();
      chartRef.current?.chart.series[0].addPoint([
        Date.now(),
        Number((data as any)?.[currentCount.id]),
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
    <div className="flex flex-col items-center gap-4">
      <Card className="flex w-full flex-col items-center justify-center text-center">
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="mt-2 h-6 w-48 rounded-lg" />
            <Skeleton className="mt-1 h-5 w-32 rounded-lg" />
          </>
        ) : (
          <>
            <img
              src={user.avatar}
              alt={user.name + " avatar"}
              className="h-20 w-20 rounded-full"
            />
            <h1 className="mt-2 text-2xl">{user.title}</h1>
            <p className="text-sm text-zinc-400">{user.handle}</p>
          </>
        )}
        <Odometer
          className="text-5xl !leading-[1.2em] sm:text-7xl xl:text-9xl"
          value={(counts as any)?.[currentCount.id] ?? 0}
        />
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <currentCount.icon className="h-4 w-4" />
          {currentCount.name}
        </div>
      </Card>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {countList
          .filter((c) => c.id !== count)
          .map((c) => {
            const newSearchParams = new URLSearchParams(searchParams);
            if (c.id === countList[0].id) newSearchParams.delete("count");
            else newSearchParams.set("count", c.id);

            const length = [...newSearchParams.entries()].length;
            const params = length === 0 ? "" : "?" + newSearchParams.toString();

            return (
              <a
                key={c.id}
                href={`/youtube/channel/${id}${params}`}
                className="flex flex-col items-center justify-center gap-1 rounded-lg border border-zinc-600 bg-zinc-900 p-4 text-center transition-colors @container hover:bg-zinc-800"
              >
                <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                  <c.icon className="h-4 w-4" />
                  {c.name}
                </div>
                <Odometer
                  className="text-3xl !leading-[1.2em] @md:text-4xl"
                  value={(counts as any)?.[c.id] ?? 0}
                />
              </a>
            );
          })}
        <Card className="flex flex-col items-center justify-center gap-1 text-center @container">
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <Goal className="h-4 w-4" />
            Goal
          </div>
          <Odometer
            className="text-3xl !leading-[1.2em] @md:text-4xl"
            value={getGoal((counts as any)[currentCount.id] ?? 0)}
          />
        </Card>
      </div>
      <Card className="w-full py-6">
        <HighchartsReact
          highcharts={Highcharts}
          options={graphOptions(user?.title ?? "")}
          ref={chartRef}
        />
      </Card>
      <Link
        to={`/embed/youtube/channel/${id}?api=${api}`}
        className="rounded-lg border border-zinc-600 bg-zinc-900 px-4 py-2 transition-colors hover:bg-zinc-800"
      >
        Embed
      </Link>
      <Card className="space-y-2 p-4">
        <div className="flex items-center justify-center gap-1.5 text-center">
          <h1 className="font-semibold">Select an API:</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                <Info className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm border text-center text-foreground">
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
      </Card>
    </div>
  );
}
