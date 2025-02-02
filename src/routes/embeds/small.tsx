import { apis, useLiveUser } from "@/hooks/use-user";
import { useParams, useSearchParams } from "react-router";
import Odometer from "react-odometerjs";
import { Skeleton } from "@/components/ui/skeleton";

export default function SmallEmbed() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const selectedApi =
    apis.find((a) => a.id === searchParams.get("api")) ?? apis[0];

  const { user, isLoading, counts } = useLiveUser({
    id: id!,
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
          <Skeleton className="h-4 my-1 rounded-md w-48" />
        ) : (
          <p>{user.title}</p>
        )}
        <Odometer
          value={counts.subscribers}
          className="text-[50px] !leading-[1.2em]"
        />
      </div>
    </div>
  );
}
