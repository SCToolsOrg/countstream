import { page } from "$app/state";
import type { Count, Info } from "$lib/counts";
import { calculateGoal } from "$lib/goal";
import { writable } from "svelte/store";

export function useCounts(
  count: Count,
  id: string,
  info?: Info,
  run?: (counts: number[], isNewVideo: boolean) => void
) {
  const counts = writable<number[]>([]);
  const goalCount = $derived(
    parseInt(page.url.searchParams.get("goal-count") ?? "0")
  );

  let currentVideoId = $state(info?.videoId);

  $effect(() => {
    const videoType = page.url.searchParams.get("videoType") || "UU";
    let latestVideoInterval: ReturnType<typeof setInterval>;

    const update = async () => {
      let newCounts: number[];

      if (count.platform === "youtube" && count.type === "latest-video") {
        newCounts = await count.getCounts(currentVideoId ?? "");
      } else {
        newCounts = await count.getCounts(id);
      }

      counts.set([...newCounts, calculateGoal(newCounts[goalCount])]);
      run?.(newCounts, false);
    };

    const updateLatestVideo = async () => {
      const playlistId = id.replace("UC", videoType);
      const res = await fetch(
        `https://yt.sctools.org/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet&fields=items/snippet/resourceId/videoId&maxResults=1`
      );
      const data = await res.json();
      if (!data?.items?.length) return;

      const newVideoId = data.items[0].snippet.resourceId.videoId;
      const isNewVideo = !!(currentVideoId && currentVideoId !== newVideoId);
      currentVideoId = newVideoId;

      const newCounts = await count.getCounts(newVideoId);

      run?.(newCounts, isNewVideo);
      counts.set([...newCounts, calculateGoal(newCounts[goalCount])]);
      return;
    };

    update();
    const interval = setInterval(update, 2000);

    if (count.platform === "youtube" && count.type === "latest-video") {
      latestVideoInterval = setInterval(updateLatestVideo, 60000);
    }

    return () => {
      clearInterval(interval);
      if (latestVideoInterval) {
        clearInterval(latestVideoInterval);
      }
    };
  });

  return {
    counts: {
      subscribe: counts.subscribe,
    },
  };
}
