import { counts } from "$lib/counts";
import { notFound } from "$lib/utils";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import PartyPopper from "@lucide/svelte/icons/party-popper";

export const load: LayoutLoad = async ({ params, url }) => {
  const { searchParams } = url;

  let countIndex = searchParams.get("count");
  if (!countIndex) countIndex = "0";

  const count = counts.find(
    (c) => c.platform === params.platform && c.type === params.type
  );
  if (!count) throw notFound();

  const countList = [
    ...count.counts,
    {
      name: "Goal",
      icon: PartyPopper,
    },
  ];
  count.counts = countList;

  const info = await count.getInfo(params.id);
  if (!info.data) {
    if (!info.error) throw notFound();
    else throw error(404, info.error);
  }

  return {
    id: params.id,
    count,
    countIndex: parseInt(countIndex),
    info: info.data,
  };
};
