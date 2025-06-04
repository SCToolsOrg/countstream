import { Camera, Eye, Users } from "@lucide/svelte";
import type { Component } from "svelte";
import colors from "tailwindcss/colors";

export interface Count {
  platform: string;
  type: string;
  name: string;
  icon: string;
  smallIcon?: string;
  color: string;
  getInfo: (id: string) => Promise<{
    name: string;
    avatar: string;
    handle?: string;
  }>;
  getCounts: (id: string) => Promise<number[]>;
  counts: {
    name: string;
    icon: Component;
  }[];
}

export const counts: Count[] = [
  {
    platform: "youtube",
    type: "channel",
    name: "YouTube Live Subscriber Counter",
    icon: "/youtube.png",
    color: colors.red[500],
    getInfo: async (id) => {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${id}&key=AIzaSyBAqQyzfH8pLouP-JmNkfd_NUX2YYyI-2o`
      );
      const data = await res.json();
      return {
        name: data.items[0].snippet.title,
        handle: data.items[0].snippet.customUrl,
        avatar: data.items[0].snippet.thumbnails.high.url,
      };
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
];
