import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { abbreviate } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo, useRef } from "react";
import { Link } from "react-router";

export default function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    mutate,
    data: results,
    status,
    error,
  } = useMutation({
    mutationKey: ["search", "youtube", "channel"],
    mutationFn: async (query: string) => {
      if (query.length === 0) throw new Error("No query provided");

      const res = await fetch(
        `https://yt-api.tca-tech.workers.dev/channels/search?q=${query}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error.text);
      if (!data?.items || data.items.length === 0)
        throw new Error("No results found");

      return data.items;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-zinc-600 bg-zinc-900 p-4">
        <div className="flex flex-col items-center justify-center gap-1.5 text-center">
          <svg
            viewBox="0 0 256 180"
            width="256"
            height="180"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            className="size-16"
          >
            <path
              d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
              fill="red"
            />
            <path
              fill="#FFF"
              d="m102.421 128.06 66.328-38.418-66.328-38.418z"
            />
          </svg>
          <h1 className="text-2xl font-bold">
            YouTube Live Subscriber Counter
          </h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate(inputRef.current!.value);
          }}
          className="mx-auto flex w-full max-w-xl flex-col items-center gap-2 md:flex-row"
        >
          <Input
            ref={inputRef}
            placeholder="Search for a YouTube channel..."
            disabled={status === "pending"}
          />
          <Button
            className="w-full disabled:cursor-not-allowed disabled:opacity-50 md:w-24"
            disabled={status === "pending"}
          >
            {status === "pending" ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </form>
      </div>
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 text-center">
        {status === "pending" ? (
          <Loader2 className="h-10 w-10 animate-spin" />
        ) : status === "error" ? (
          <p className="text-red-500">{error.message}</p>
        ) : (
          status === "success" &&
          results.map((result: any) => (
            <Link
              key={result.id}
              to={`/youtube/channel/${result.id}`}
              className="flex w-full items-center gap-3 rounded-lg border bg-zinc-900 p-4 transition-colors hover:bg-zinc-800"
            >
              <img
                src={result.avatar}
                alt={result.title}
                className="size-12 rounded-full"
              />
              <div className="text-left">
                <h1 className="text-2xl font-bold">{result.title}</h1>
                <p className="text-sm opacity-50">
                  {result.handle} &bull; {abbreviate(result.subscribers)}{" "}
                  subscribers
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
