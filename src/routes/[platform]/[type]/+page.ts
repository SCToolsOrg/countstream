import { counts } from "$lib/counts";
import { notFound } from "$lib/utils";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  const count = counts.find(
    (c) => c.platform === params.platform && c.type === params.type
  );
  if (!count) throw notFound();

  return count;
};
