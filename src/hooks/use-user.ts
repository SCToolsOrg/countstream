import { useQuery } from "@tanstack/react-query";

export interface API {
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

export const apis = [
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

export function useUser(id: string) {
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
  return {
    user,
    isLoading,
  };
}

export function useLiveUser(options: {
  id: string;
  api: API;
  onRequest?: (data: {
    subscribers: number;
    views: number;
    videos: number;
  }) => void;
}) {
  const { user, isLoading } = useUser(options.id);
  const { data: counts } = useQuery({
    queryKey: ["counts", options.id, options.api.id],
    queryFn: async () => {
      const res = await fetch(
        options.api.url.replace("<id>", options.id ?? ""),
      );
      const data = await res.json();
      const parsedData = options.api.parseData(data);

      options.onRequest?.(parsedData);

      return parsedData;
    },
    refetchInterval: 2000,
  });
  return {
    user,
    isLoading,
    counts: counts ?? {
      subscribers: 0,
      views: 0,
      videos: 0,
    },
  };
}
