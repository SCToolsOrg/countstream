import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Odometer from "react-odometerjs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Camera,
  ChartLine,
  ChevronDown,
  ChevronUp,
  Cog,
  Eye,
  Goal,
  Info,
  Sparkles,
  Users,
} from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";

interface API {
  id: string;
  name: string;
  description: string;
  url: string;
  stable: boolean;
  accurate: boolean;
  down?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseData: (data: any) => {
    subscribers: number;
    views: number;
    videos: number;
  };
}

const apis = [
  {
    id: "mixerno",
    name: "Mixerno.space",
    description: "An extremely stable and popular API used by many streamers",
    url: "https://mixerno.space/api/youtube-channel-counter/user/<id>",
    stable: true,
    accurate: true,
    parseData: (data) => ({
      subscribers: data.counts[0].count,
      views: data.counts[3].count,
      videos: data.counts[5].count,
    }),
  },
  {
    id: "mixerno-v4",
    name: "Mixerno.space (v4)",
    description:
      "Mixerno.space's experimental estimations. Only supports a handful of channels.",
    url: "https://estv4.mixerno.space/api/v1/get/<id>",
    stable: false,
    accurate: true,
    parseData: (data) => ({
      subscribers: Math.floor(data.data.estCounts[0]),
      views: data.data.apiCounts[1],
      videos: data.data.apiCounts[2],
    }),
  },
  {
    id: "lcxyz",
    name: "Livecounts.xyz",
    description:
      "An API created by the same creator of Mixerno.space. A little more stable than Mixerno.space.",
    url: "https://livecounts.xyz/api/youtube-live-subscriber-count/live/<id>",
    stable: true,
    accurate: false,
    parseData: (data) => ({
      subscribers: data.counts[0],
      views: data.counts[1],
      videos: data.counts[2],
    }),
  },
  {
    id: "axern-realistic",
    name: "Axern.space (realistic)",
    description:
      "An API created by the same creator of Mixerno.space. A lot less stable than Mixerno.space.",
    url: "https://axern.space/api/get?platform=youtube&type=channel&id=<id>",
    stable: false,
    accurate: true,
    parseData: (data) => ({
      subscribers: data.estSubCount,
      views: data.estViewCount,
      videos: data.apiVideoCount,
    }),
  },
  {
    id: "axern-linear",
    name: "Axern.space (linear)",
    description: "Same as Axern.space but uses a linear estimation style.",
    url: "https://axern.space/api/get?platform=youtube&type=channel&id=<id>",
    stable: false,
    accurate: false,
    parseData: (data) => ({
      subscribers: data.estSubCount_linear,
      views: data.estViewCount,
      videos: data.apiVideoCount,
    }),
  },
  {
    id: "axern-semilinear",
    name: "Axern.space (semi-linear)",
    description: "Same as Axern.space but uses a semi-linear estimation style.",
    url: "https://axern.space/api/get?platform=youtube&type=channel&id=<id>",
    stable: false,
    accurate: false,
    parseData: (data) => ({
      subscribers: data.estSubCount_semilinear,
      views: data.estViewCount,
      videos: data.apiVideoCount,
    }),
  },
  {
    id: "socialcounts",
    name: "SocialCounts.org",
    description: "A decently popular and stable API",
    url: "https://api.socialcounts.org/youtube-live-subscriber-count/<id>",
    stable: true,
    accurate: false,
    parseData: (data) => ({
      subscribers: data.est_sub,
      views: data.table[0].count,
      videos: data.table[1].count,
    }),
  },
  {
    id: "communitrics",
    name: "Communitrics",
    description:
      "Very accurate estimations for channels like PewDiePie. Doesn't support views or videos though.",
    url: "https://api.communitrics.com/<id>",
    stable: false,
    accurate: true,
    parseData: (data) => ({
      subscribers: data.channelDetails.linearEstSubscriberCount,
      views: 0,
      videos: 0,
    }),
  },
  {
    id: "nia-studio",
    name: "Nia's Studio System",
    description:
      "A website built by Nia. Counts coming directly from the channel's YouTube Studio.",
    stable: true,
    accurate: true,
    down: true,
    // TODO
    url: "",
    parseData: (data) => ({
      subscribers: data.channels.counts[2].count,
      views: 0,
      videos: 0,
    }),
  },
] satisfies API[];

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
  const recommendedApi = useMemo(
    () => (id === "UC-lHJZR3Gqxm24_Vd_AJ5Yw" ? "communitrics" : "mixerno"),
    [id],
  );

  const [api, setApi] = useQueryState(
    "api",
    parseAsStringEnum(apis.map((api) => api.id)).withDefault(recommendedApi),
  );
  const selectedApi = apis.find((a) => a.id === api) ?? apis[0];

  const [apiDropdownOpen, setApiDropdownOpen] = useState(false);

  const [count, setCount] = useQueryState(
    "count",
    parseAsStringEnum(countList.map((c) => c.id)).withDefault("subscribers"),
  );
  const currentCount = countList.find((c) => c.id === count) ?? countList[0];

  const chartRef = useRef<HighchartsReactRefObject>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetch(
        `https://yt-api.tca-tech.workers.dev/channels/${id}`,
      );
      const data = await res.json();
      return data.user;
    },
  });
  const { data: counts } = useQuery({
    queryKey: ["counts", id],
    queryFn: async () => {
      const res = await fetch(selectedApi.url.replace("<id>", id ?? ""));
      const data = await res.json();
      const parsedData = selectedApi.parseData(data);

      if (!chartRef.current) return parsedData;
      if (chartRef.current.chart.series[0].points.length >= 3600)
        chartRef.current.chart.series[0].data[0].remove();
      chartRef.current?.chart.series[0].addPoint([
        Date.now(),
        Number(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (parsedData as any)?.[currentCount.id],
        ),
      ]);

      return parsedData;
    },
    refetchInterval: 2000,
  });

  function getGoal(count: string | number) {
    count = parseFloat(count.toString());
    if (count == null) return 0;
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
        <DropdownMenu open={apiDropdownOpen} onOpenChange={setApiDropdownOpen}>
          <DropdownMenuTrigger className="flex items-center justify-between w-[240px] bg-card border px-3 py-2 rounded-lg text-sm">
            <span>{selectedApi.name}</span>
            {apiDropdownOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="sm:w-64">
            <DropdownMenuLabel>Stable APIs</DropdownMenuLabel>
            {apis
              .filter((api) => api.stable)
              .map((api) => (
                <ApiItem
                  key={api.id}
                  name={user?.title}
                  api={api}
                  setApi={setApi}
                  recommendedApi={recommendedApi}
                />
              ))}
            <DropdownMenuLabel>Unstable/Experimental APIs</DropdownMenuLabel>
            {apis
              .filter((api) => !api.stable)
              .map((api) => (
                <ApiItem
                  key={api.id}
                  name={user?.title}
                  api={api}
                  setApi={setApi}
                  recommendedApi={recommendedApi}
                />
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function ApiItem({
  name = "",
  api,
  setApi,
  recommendedApi,
}: {
  name?: string;
  api: API;
  setApi: (id: string) => void;
  recommendedApi: string;
}) {
  return (
    <DropdownMenuItem
      onClick={() => !api.down && setApi(api.id)}
      className={cn("justify-between gap-0", api.down && "opacity-50")}
    >
      <div className="flex items-center gap-1.5">
        <p>{api.name}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <Info className="h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent className="bg-card text-foreground border max-w-sm text-center">
              {api.description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-1">
        {!api.stable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default p-1 bg-red-950 text-red-500 rounded-sm">
                <Cog className="w-3 h-3" />
              </TooltipTrigger>
              <TooltipContent className="bg-card text-foreground border max-w-sm text-center">
                Not very stable. May not work or be slow sometimes.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {api.accurate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default p-1 bg-yellow-950 text-yellow-500 rounded-sm">
                <ChartLine className="w-3 h-3" />
              </TooltipTrigger>
              <TooltipContent className="bg-card text-foreground border max-w-sm text-center">
                Very accurate estimations
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {recommendedApi === api.id && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default p-1 bg-green-950 text-green-500 rounded-sm">
                <Sparkles className="w-3 h-3" />
              </TooltipTrigger>
              <TooltipContent className="bg-card text-foreground border max-w-sm text-center">
                Recommended API for {name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </DropdownMenuItem>
  );
}
