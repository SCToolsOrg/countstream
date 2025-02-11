import { Skeleton } from "@/components/ui/skeleton";
import { apis, useLiveUser, useRecommendedApi } from "@/hooks/use-user";
import { Camera, Eye, Users } from "lucide-react";
import { FC } from "react";
import Odometer from "react-odometerjs";
import { useParams } from "react-router";
import { useEmbedState } from "./state";

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

export default function LargeEmbed() {
  const { id } = useParams();
  if (!id) throw new Error("Invalid state?");

  const recommendedApi = useRecommendedApi(id);

  const api = useEmbedState("api", recommendedApi);
  const selectedApi = apis.find((a) => a.id === api) ?? apis[0];
  const count = useEmbedState("count", "subscribers");
  const currentCount = countList.find((c) => c.id === count) ?? countList[0];

  const { user, isLoading, counts } = useLiveUser({
    id,
    api: selectedApi,
  });

  return (
    <div className="flex w-full flex-col items-center justify-center text-center">
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
        className="text-5xl font-semibold tabular-nums !leading-[1.2em] sm:text-7xl xl:text-9xl"
        value={(counts as any)?.[currentCount.id] ?? 0}
      />
      <div className="flex items-center gap-1.5 text-sm text-zinc-400">
        <currentCount.icon className="h-4 w-4" />
        {currentCount.name}
      </div>
    </div>
  );
}
