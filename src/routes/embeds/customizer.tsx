import { parseAsStringEnum, useQueryState } from "nuqs";
import { FC, useMemo } from "react";
import { useParams } from "react-router";
import { apis, useLiveUser } from "@/hooks/use-user";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import SmallEmbed from "./small";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import ApiDropdown from "@/components/api-dropdown";

interface Embed {
  id: string;
  name: string;
  component: FC;
}

const embeds = [
  {
    id: "small",
    name: "Small",
    component: SmallEmbed,
  },
] satisfies Embed[];

export default function EmbedCustomizer() {
  const { id } = useParams();

  const recommendedApi = useMemo(
    () => (id === "UC-lHJZR3Gqxm24_Vd_AJ5Yw" ? "communitrics" : "mixerno"),
    [id],
  );
  const [api, setApi] = useQueryState(
    "api",
    parseAsStringEnum(apis.map((api) => api.id)).withDefault(recommendedApi),
  );
  const selectedApi = apis.find((a) => a.id === api) ?? apis[0];

  const [embedType, setEmbedType] = useQueryState(
    "type",
    parseAsStringEnum(embeds.map((embed) => embed.id)).withDefault("small"),
  );
  const currentEmbed = embeds.find((e) => e.id === embedType) ?? embeds[0];

  const { user } = useLiveUser({
    id: id!,
    api: selectedApi,
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col items-center gap-4">
      <div className="w-full">
        <currentEmbed.component />
      </div>
      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-600 flex flex-col items-center justify-center text-center w-full gap-2">
        <h1 className="font-semibold">Embed type:</h1>
        <RadioGroup value={embedType} onValueChange={setEmbedType}>
          {embeds.map((embed) => (
            <div key={embed.id} className="flex items-center space-x-2">
              <RadioGroupItem value={embed.id} id={embed.id} />
              <Label htmlFor={embed.id}>{embed.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-600 flex flex-col items-center justify-center text-center gap-2">
        <div className="flex items-center justify-center text-center gap-1.5">
          <h1 className="font-semibold">Select an API:</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                <Info className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent className="bg-card text-foreground border max-w-sm text-center">
                The APIs listed here allow you to pick between different
                estimations. Some are more accurate and stable than others.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ApiDropdown
          name={user?.title ?? ""}
          selectedApi={selectedApi}
          setApi={setApi}
          recommendedApi={recommendedApi}
        />
      </div>
    </div>
  );
}
