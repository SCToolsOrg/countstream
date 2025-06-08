import {
  Camera,
  Eye,
  Heart,
  Image,
  List,
  MessageSquare,
  Rss,
  ThumbsUp,
  Users,
} from "@lucide/svelte";
import type { Component } from "svelte";

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
    search: async (query) => {
      const res = await fetch(
        `https://mixerno.space/api/youtube-channel-counter/search/${encodeURI(query)}`
      );
      const data = await res.json();
      if (!data?.list?.length) return [];

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
    search: async (query) => {
      const res = await fetch(
        `https://mixerno.space/api/youtube-video-counter/search/${encodeURI(query)}`
      );
      const data = await res.json();
      if (!data?.list?.length) return [];

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
  {
    platform: "youtube",
    type: "stream",
    name: "YouTube Live Viewer Counter",
    icon: "/youtube.png",
    avatarType: "square",
    search: async (query) => {
      const res = await fetch(
        `https://mixerno.space/api/youtube-stream-counter/search/${encodeURI(query)}`
      );
      const data = await res.json();
      if (!data?.list?.length) return [];

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
        `https://mixerno.space/api/youtube-stream-counter/user/${id}`
      );
      const { counts } = await res.json();
      return [
        parseInt(counts[0].count),
        parseInt(counts[2].count),
        parseInt(counts[4].count),
      ];
    },
    counts: [
      {
        name: "Viewers",
        icon: Eye,
      },
      {
        name: "Likes",
        icon: ThumbsUp,
      },
      {
        name: "Total Views",
        icon: Eye,
      },
    ],
  },
  {
    platform: "twitter",
    type: "user",
    name: "Twitter Live Follower Counter",
    icon: "/twitter.png",
    search: async (query) => {
      const res = await fetch(
        `https://mixerno.space/api/twitter-user-counter/search/${encodeURI(query)}`
      );
      const data = await res.json();
      if (!data?.list?.length) return [];

      return data.list.map(([name, avatar, id]: [string, string, string]) => ({
        name,
        avatar,
        id,
      }));
    },
    getInfo: async (username: string) => {
      try {
        const res = await fetch(
          `https://backend.mixerno.space/api/twitter/twitter/${username}`
        );
        const data = await res.json();
        const result = data?.data?.user?.result;
        if (!result) return { data: null, error: null };

        return {
          data: {
            name: result.legacy.name ?? result.legacy.screen_name,
            username: `@` + result.legacy.screen_name,
            avatar: result.legacy.profile_image_url_https.replace(
              "_normal",
              "_400x400"
            ),
            banner: result.legacy.profile_banner_url,
          },
          error: null,
        };
      } catch {
        return { data: null, error: null };
      }
    },
    getCounts: async (username: string) => {
      const res = await fetch(
        `https://backend.mixerno.space/api/twitter/twitter/${username}`
      );
      const data = await res.json();
      const result = data?.data?.user?.result;
      return [
        result.legacy.followers_count,
        result.legacy.friends_count,
        result.legacy.favourites_count,
        result.legacy.listed_count,
        result.legacy.statuses_count,
        result.legacy.media_count,
      ];
    },
    counts: [
      {
        name: "Followers",
        icon: Users,
      },
      {
        name: "Following",
        icon: Users,
      },
      {
        name: "Liked Tweets",
        icon: Heart,
      },
      {
        name: "Lists",
        icon: List,
      },
      {
        name: "Tweets",
        icon: Rss,
      },
      {
        name: "Media",
        icon: Image,
      },
    ],
  },
  {
    platform: "tiktok",
    type: "user",
    name: "TikTok Live Follower Counter",
    icon: "/tiktok.png",
    search: async (query: string) => {
      const res = await fetch(
        `https://api.subscriberwars.space/search/tiktok/channel/${encodeURI(query)}`
      );
      const data = await res.json();
      if (!data?.items?.length) return [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.items.map((item: any) => ({
        name: item.title,
        id: item.id,
        avatar: item.pfp,
      }));
    },
    getInfo: async (id: string) => {
      try {
        const res = await fetch(
          `https://api.subscriberwars.space/tiktok/channel/${id}`
        );
        const data = await res.json();
        return {
          data: {
            name: data.nickname ?? data.username,
            username: "@" + data.username,
            avatar: data.pfp,
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
    getCounts: async (id: string) => {
      const res = await fetch(
        `https://api.subscriberwars.space/tiktok/channel/${id}`
      );
      const data = await res.json();
      return [data.followers, data.following, data.likes];
    },
    counts: [
      {
        name: "Followers",
        icon: Users,
      },
      {
        name: "Following",
        icon: Users,
      },
      {
        name: "Likes",
        icon: Heart,
      },
    ],
  },
];
