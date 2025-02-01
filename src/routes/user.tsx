import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Odometer from "react-odometerjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface API {
  id: string;
  name: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseData: (data: any) => {
    subscribers: number;
  };
}

const apis = [
  {
    id: "mixerno",
    name: "Mixerno.space",
    url: "https://mixerno.space/api/youtube-channel-counter/user/<id>",
    parseData: (data) => ({
      subscribers: data.counts[0].count,
    }),
  },
  {
    id: "axern-realistic",
    name: "Axern.space (realistic)",
    url: "https://axern.space/api/get?platform=youtube&type=channel&id=<id>",
    parseData: (data) => ({
      subscribers: data.estSubCount,
    }),
  },
  {
    id: "axern-linear",
    name: "Axern.space (linear)",
    url: "https://axern.space/api/get?platform=youtube&type=channel&id=<id>",
    parseData: (data) => ({
      subscribers: data.estSubCount_linear,
    }),
  },
  {
    id: "axern-semilinear",
    name: "Axern.space (semi-linear)",
    url: "https://axern.space/api/get?platform=youtube&type=channel&id=<id>",
    parseData: (data) => ({
      subscribers: data.estSubCount_semilinear,
    }),
  },
  {
    id: "communitrics",
    name: "Communitrics",
    url: "https://api.communitrics.com/<id>",
    parseData: (data) => ({
      subscribers: data.channelDetails.linearEstSubscriberCount,
    }),
  },
] satisfies API[];

// TODO: support multiple platforms
export default function User() {
  const { id } = useParams();
  const [api, setApi] = useQueryState(
    "api",
    parseAsStringEnum(apis.map((api) => api.id)).withDefault("mixerno"),
  );

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
      const apiConfig = apis.find((a) => a.id === api);
      if (!apiConfig) throw new Error("Invalid state");

      const res = await fetch(apiConfig.url.replace("<id>", id ?? ""));
      const data = await res.json();
      return apiConfig.parseData(data);
    },
    refetchInterval: 2000,
  });

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
          value={counts?.subscribers ?? 0}
        />
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <Users className="w-4 h-4" />
          Subscribers
        </div>
      </div>
      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-600 text-center space-y-2">
        <h1 className="font-semibold">Select an API:</h1>
        <Select value={api} onValueChange={setApi}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select an API" />
          </SelectTrigger>
          <SelectContent>
            {apis.map((api) => (
              <SelectItem key={api.id} value={api.id}>
                {api.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
