import { page } from "$app/state";
import type { Count, Info } from "$lib/counts";
import { calculateGoal } from "$lib/goal";
import { writable } from "svelte/store";

const jsalStatsChannels = [
  "UCrZKnWgOaYTTc7sc1KsVXZw",
  "UCUXNOmIdsoyd5fh5TZHHO5Q",
  "UCxLIJccyaRQDeyu6RzUsPuw",
  "UCd15dSPPT-EhTXekA7_UNAQ",
  "UCewMTclBJZPaNEfbf-qYMGA",
];

export function useCounts(
  count: Count,
  id: string,
  info?: Info,
  run?: (counts: number[], isNewVideo: boolean) => void
) {
  const counts = writable<number[]>([]);
  const isStudio = writable<boolean | undefined>(undefined);
  const goalCount = $derived(
    parseInt(page.url.searchParams.get("goal-count") ?? "0")
  );
  let studioInterval = $state.raw<ReturnType<typeof setInterval>>();

  const check = async () => {
    try {
      const res = await fetch(
        `https://api-v2.nextcounts.com/api/youtube/channel/${id}`
      );
      const data = await res.json();
      if (!data.success) return;
      isStudio.set(data.verifiedSubCount);
    } catch {
      // do nothing
    }
  };

  $effect(() => {
    if (count.platform === "youtube" && count.type === "channel") {
      if (id === "UCX6OQ3DkcsbYNE6H8uQQuVA" || jsalStatsChannels.includes(id)) {
        isStudio.set(true);
      } else {
        check();
      }
    }
  });

  let studio = $state.raw<boolean | undefined>(undefined);
  isStudio.subscribe((isStudio) => {
    studio = isStudio;
  });

  let currentVideoId = $state(info?.videoId);

  $effect(() => {
    const videoType = page.url.searchParams.get("videoType") || "UU";
    let latestVideoInterval: ReturnType<typeof setInterval>;

    const update = async () => {
      if (
        count.platform === "youtube" &&
        count.type === "channel" &&
        typeof studio === "undefined"
      )
        return;

      let newCounts: number[];
      if (
        count.platform === "youtube" &&
        count.type === "channel" &&
        studio &&
        id !== "UCX6OQ3DkcsbYNE6H8uQQuVA"
      ) {
        if (studioInterval) {
          clearInterval(studioInterval);
          studioInterval = undefined;
        }

        if (jsalStatsChannels.includes(id)) {
          const [subCounts, data] = await Promise.all([
            fetch("https://studio.jsalstats.xyz/subcount"),
            fetch(`https://backend.mixerno.space/api/youtube/estv3/${id}`),
          ]).then((responses) =>
            Promise.all(responses.map((res) => res.json()))
          );

          newCounts = [
            subCounts[id],
            data.items[0].statistics.subscriberCountAPI,
            data.items[0].statistics.viewCountAPI,
            data.items[0].statistics.videoCount,
          ];
        } else {
          const res = await fetch(
            `https://api-v2.nextcounts.com/api/youtube/channel/${id}`
          );
          const data = await res.json();
          isStudio.set(data.verifiedSubCount);

          const abbreviateNumber = (num: number) =>
            num.toString().slice(0, 3) +
            new Array(num.toString().length - 3).fill("0").join("");
          newCounts = [
            data.subcount,
            abbreviateNumber(data.subcount),
            data.viewcount,
            data.videos,
          ];
        }
      } else if (
        count.platform === "youtube" &&
        count.type === "latest-video"
      ) {
        newCounts = await count.getCounts(currentVideoId ?? "");
      } else {
        newCounts = await count.getCounts(id);
        studioInterval = setInterval(check, 5 * 60 * 1000);
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
      if (studioInterval) {
        clearInterval(studioInterval);
      }
      if (latestVideoInterval) {
        clearInterval(latestVideoInterval);
      }
    };
  });

  return {
    counts: {
      subscribe: counts.subscribe,
    },
    isStudio: {
      subscribe: isStudio.subscribe,
    },
  };
}
