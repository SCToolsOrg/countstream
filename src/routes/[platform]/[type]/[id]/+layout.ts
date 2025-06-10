import { counts } from "$lib/counts";
import { notFound } from "$lib/utils";
import type { LayoutLoad } from "./$types";
import PartyPopper from "@lucide/svelte/icons/party-popper";

export const ssr = false;
export const csr = true;
export const prerender = false;

export const load: LayoutLoad = async ({ params, url }) => {
  const { searchParams } = url;

  let countIndex = searchParams.get("count");
  if (!countIndex) countIndex = "0";

  let count = counts.find(
    (c) => c.platform === params.platform && c.type === params.type
  );
  if (!count) throw notFound();

  count = {
    ...count,
    counts: [
      ...count.counts,
      {
        name: "Goal",
        icon: PartyPopper,
      },
    ],
  };

  const info = await count.getInfo(params.id);
  if (!info) throw notFound();

  return {
    id: params.id,
    count,
    countIndex: parseInt(countIndex),
    info,
  };
};
