import { counts } from "$lib/counts";
import { notFound } from "$lib/utils";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, url }) => {
  const { searchParams } = url;

  let countIndex = searchParams.get("count");
  if (!countIndex) countIndex = "0";

  const count = counts.find(
    (c) => c.platform === params.platform && c.type === params.type
  );
  if (!count) throw notFound();

  const currentCount = count.counts.find((_, i) => i === parseInt(countIndex));
  if (!currentCount) throw notFound();

  const info = await count.getInfo(params.id);
  if (!info) throw notFound();

  return {
    id: params.id,
    count,
    countIndex: parseInt(countIndex),
    info,
  };
};
