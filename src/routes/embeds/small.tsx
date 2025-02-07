import { apis, useLiveUser, useRecommendedApi } from "@/hooks/use-user";
import { useParams } from "react-router";
import Odometer from "react-odometerjs";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmbedState } from "./state";

export default function SmallEmbed() {
  const { id } = useParams();
  if (!id) throw new Error("Invalid state?");

  const recommendedApi = useRecommendedApi(id);

  const api = useEmbedState("api", recommendedApi);
  const selectedApi = apis.find((a) => a.id === api) ?? apis[0];
  const count = useEmbedState("count", "subscribers");

  const { user, isLoading, counts } = useLiveUser({
    id,
    api: selectedApi,
  });

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Skeleton className="size-[90px] rounded-full" />
      ) : (
        <img
          src={user.avatar}
          alt={user.name + " avatar"}
          width={90}
          height={90}
          className="rounded-full"
        />
      )}
      <div className="flex flex-col">
        {isLoading ? (
          <Skeleton className="my-1 h-4 w-48 rounded-md" />
        ) : (
          <p>{user.title}</p>
        )}
        <Odometer
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={(counts as any)[count]}
          className="text-[50px] !leading-[1.2em]"
        />
      </div>
    </div>
  );
}
