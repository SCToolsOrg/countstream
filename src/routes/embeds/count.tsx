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

  const { counts } = useLiveUser({
    id: id!,
    api: selectedApi,
  });

  return (
    <div
      className={cn(
        "!leading-[1.2em]",
        sizes.find((s) => s.id === size)?.class,
      )}
      style={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textAlign: align as any,
      }}
    >
      <Odometer value={counts.subscribers} id="count" />
    </div>
  );
}
