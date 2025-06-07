import { Camera, Eye, MessageSquare, ThumbsUp, Users } from "@lucide/svelte";
import type { Component } from "svelte";
import colors from "tailwindcss/colors";

export interface Info {
  name: string;
  username?: string;
  banner?: string;
  avatar: string;
}

export interface Count {
  platform: string;
  type: string;
  name: string;
  icon: string;
  smallIcon?: string;
  color: string;
  avatarType?: "square";
  search: (query: string) => Promise<
    {
      name: string;
      id: string;
      avatar: string;
    }[]
  >;
  getInfo: (id: string) => Promise<
    | {
        data: Info;
        error: null;
      }
    | {
        data: null;
        error: string | null;
      }
  >;
  getCounts: (id: string) => Promise<number[]>;
  counts: {
    name: string;
    icon: Component;
  }[];
}

export function convertPlatformToName(platform: string) {
  switch (platform) {
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
    default:
      return platform.at(0)!.toUpperCase() + platform.slice(1).toLowerCase();
  }
}

export const counts: Count[] = [
  {
    platform: "youtube",
    type: "channel",
    name: "YouTube Live Subscriber Counter",
    icon: "/youtube.png",
    color: colors.red[500],
    search: async (query) => {
      const res = await fetch(
        `https://mixerno.space/api/youtube-channel-counter/search/${encodeURI(query)}`
      );
      const data = await res.json();
      return data.list.map(([name, avatar, id]: [string, string, string]) => ({
        name,
        avatar,
        id,
      }));
    },
    getInfo: async (id) => {
      if (!id.startsWith("UC") || id.length !== 24)
        return {
          data: null,
          error: "Invalid channel ID",
        };
      try {
        const res = await fetch(
          `https://api.subscriberwars.space/youtube/channel/${id}`
        );
        const data = await res.json();
        if (!data)
          return {
            data: null,
            error: null,
          };

        return {
          data: {
            name: data.title,
            username: data.slug,
            avatar: data.icon,
            banner: `https://www.banner.yt/${id}`,
          },
          error: null,
        };
      } catch {
        return {
          data: null,
          error: null,
        };
      }
    },
    getCounts: async (id) => {
      const res = await fetch(`https://ests.sctools.org/api/get/${id}`);
      const { stats } = await res.json();
      return [
        stats.estCount,
        stats.apiCount,
        stats.viewCount,
        stats.videoCount,
      ];
    },
    counts: [
      {
        name: "Subscribers (EST)",
        icon: Users,
      },
      {
        name: "Subscribers (API)",
        icon: Users,
      },
      {
        name: "Views",
        icon: Eye,
      },
      {
        name: "Videos",
        icon: Camera,
      },
    ],
  },
  {
    platform: "youtube",
    type: "video",
    name: "YouTube Live View Counter",
    icon: "/youtube.png",
    avatarType: "square",
    color: colors.red[500],
    search: async (query) => {
      const res = await fetch(
        `https://mixerno.space/api/youtube-video-counter/search/${encodeURI(query)}`
      );
      const data = await res.json();
      return data.list.map(([name, avatar, id]: [string, string, string]) => ({
        name,
        avatar,
        id,
      }));
    },
    getInfo: async (id) => {
      try {
        const res = await fetch(
          `https://api.subscriberwars.space/youtube/video/${id}`
        );
        const data = await res.json();
        if (!data?.items?.length)
          return {
            data: null,
            error: null,
          };

        return {
          data: {
            name: data.items[0].snippet.title,
            avatar: data.items[0].snippet.thumbnails.medium.url,
            banner: `https://www.banner.yt/${id}`,
          },
          error: null,
        };
      } catch {
        return {
          data: null,
          error: null,
        };
      }
    },
    getCounts: async (id) => {
      const res = await fetch(
        `https://mixerno.space/api/youtube-video-counter/user/${id}`
      );
      const { counts } = await res.json();
      return [
        counts[0].count,
        parseInt(counts[2].count),
        parseInt(counts[3].count),
        parseInt(counts[5].count),
      ];
    },
    counts: [
      {
        name: "Views (EST)",
        icon: Eye,
      },
      {
        name: "Views (API)",
        icon: Eye,
      },
      {
        name: "Likes",
        icon: ThumbsUp,
      },
      {
        name: "Comments",
        icon: MessageSquare,
      },
    ],
  },
];
