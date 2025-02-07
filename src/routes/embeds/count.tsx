/* eslint-disable @typescript-eslint/no-explicit-any */

import { apis, useLiveUser, useRecommendedApi } from "@/hooks/use-user";
import { useParams } from "react-router";
import Odometer from "react-odometerjs";
import { cn } from "@/lib/utils";
import { useEmbedState } from "./state";

const sizes = [
  {
    id: "small",
    class: "text-lg",
  },
  {
    id: "medium",
    class: "text-4xl",
  },
  {
    id: "large",
    class: "text-6xl",
  },
  {
    id: "extra-large",
    class: "text-[120pt]",
  },
];

const alignments = ["left", "center", "right"];

export default function CountEmbed() {
  const { id } = useParams();
  if (!id) throw new Error("Invalid state?");

  const recommendedApi = useRecommendedApi(id);

  const api = useEmbedState("api", recommendedApi);
  const selectedApi = apis.find((a) => a.id === api) ?? apis[0];
  const size = useEmbedState("size", "medium");
  const align = useEmbedState("align", alignments[0]);
  const count = useEmbedState("count", "subscribers");

  const { counts } = useLiveUser({
    id,
    api: selectedApi,
  });

  return (
    <div
      className={cn(
        "!leading-[1.2em]",
        sizes.find((s) => s.id === size)?.class,
      )}
      style={{
        textAlign: align as any,
      }}
    >
      <Odometer value={(counts as any)[count]} id="count" />
    </div>
  );
}
