import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Odometer from "react-odometerjs";
import { Skeleton } from "@/components/ui/skeleton";

// TODO: support multiple platforms
export default function User() {
  const { id } = useParams();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetch(
        `https://mixerno.space/api/youtube-channel-counter/user/${id}`,
      );
      const data = await res.json();
      return {
        name: data.user[0].count,
        avatar: data.user[1].count,
        banner: `https://www.banner.tf/${id}`,
      };
    },
  });
  const { data: counts } = useQuery({
    queryKey: ["counts", id],
    queryFn: async () => {
      const res = await fetch(
        `https://mixerno.space/api/youtube-channel-counter/user/${id}`,
      );
      const data = await res.json();
      return data.counts;
    },
    refetchInterval: 2000,
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-600 flex flex-col items-center justify-center text-center">
        {isLoading ? (
          <>
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="mt-2 h-6 rounded-lg w-48" />
            <Skeleton className="mt-1 h-5 rounded-lg w-32" />
          </>
        ) : (
          <>
            <img
              src={user?.avatar}
              alt={user?.name + " avatar"}
              className="w-20 h-20 rounded-full"
            />
            <h1 className="mt-2 text-2xl">{user?.name}</h1>
            <p className="text-sm text-zinc-400">@{user?.name.toLowerCase()}</p>
          </>
        )}
        <Odometer
          className="text-5xl sm:text-7xl xl:text-9xl !leading-[1.2em]"
          value={counts?.[0].count ?? 0}
        />
      </div>
    </div>
  );
}
