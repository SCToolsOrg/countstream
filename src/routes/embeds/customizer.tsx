import { parseAsStringEnum, useQueryState } from "nuqs";
import { FC } from "react";
import { useParams, useSearchParams } from "react-router";
import { apis, useRecommendedApi, useUser } from "@/hooks/use-user";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clipboard, Info } from "lucide-react";
import ApiDropdown from "@/components/api-dropdown";
import { createPortal } from "react-dom";
import { getEmbedState, setEmbedState } from "./state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import SmallEmbed from "./small";
import CountEmbed from "./count";

interface Embed {
  id: string;
  name: string;
  component: FC;
  options?: {
    id: string;
    name: string;
    default?: string;
    options: string[];
  }[];
}

const embeds = [
  {
    id: "small",
    name: "Small",
    component: SmallEmbed,
  },
  {
    id: "count",
    name: "Count",
    component: CountEmbed,
    options: [
      {
        id: "size",
        name: "Size",
        options: ["small", "medium", "large", "extra-large"],
        default: "medium",
      },
      {
        id: "align",
        name: "Align",
        options: ["left", "center", "right"],
        default: "left",
      },
    ],
  },
] satisfies Embed[];

export default function EmbedCustomizer() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!id) throw new Error("Invalid state?");

  const recommendedApi = useRecommendedApi(id);
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

  const { user } = useUser(id);

  return (
    <div className="flex flex-col gap-4">
      <div id="embed" className="w-full" />
      {document.getElementById("embed") &&
        createPortal(
          <currentEmbed.component />,
          document.getElementById("embed")!,
        )}
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-zinc-600 bg-zinc-900 p-4 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="font-semibold">Embed type:</h1>
          <RadioGroup
            value={embedType}
            onValueChange={setEmbedType}
            className="flex flex-wrap items-center gap-2"
          >
            {embeds.map((embed) => (
              <div key={embed.id} className="flex items-center space-x-2">
                <RadioGroupItem value={embed.id} id={embed.id} />
                <Label htmlFor={embed.id}>{embed.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex w-full items-center gap-2">
          <Input
            value={`${window.location.origin}/embed/${currentEmbed.id}/youtube/channel/${id}?${new URLSearchParams(getEmbedState())}`}
            readOnly
          />
          <Button
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/embed/${currentEmbed.id}/youtube/channel/${id}?${new URLSearchParams(getEmbedState())}`,
              );
            }}
          >
            <Clipboard />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-zinc-600 bg-zinc-900 p-4 text-center">
        <div className="flex items-center justify-center gap-1.5 text-center">
          <h1 className="font-semibold">Select an API:</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                <Info className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm border bg-card text-center text-foreground">
                The APIs listed here allow you to pick between different
                estimations. Some are more accurate and stable than others.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ApiDropdown
          name={user?.title ?? ""}
          selectedApi={selectedApi}
          setApi={(api) => {
            setEmbedState("api", api);
            setApi(api);
          }}
          recommendedApi={recommendedApi}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-zinc-600 bg-zinc-900 p-4 text-center md:flex-row md:flex-wrap">
        <div className="space-y-2">
          <p className="font-bold">Count:</p>
          <Select
            defaultValue={searchParams.get("count") ?? "subscribers"}
            onValueChange={(value) => {
              setEmbedState("count", value);
              setSearchParams((prev) => {
                prev.set("count", value);
                prev.set("type", currentEmbed.id);
                return prev;
              });
            }}
          >
            <SelectTrigger className="w-[210px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subscribers">Subscribers</SelectItem>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {currentEmbed.options?.map((option) => (
          <div key={option.id} className="space-y-2">
            <p className="font-bold">{option.name}:</p>
            <Select
              defaultValue={
                searchParams.get(option.id) ??
                option.default ??
                option.options[0]
              }
              onValueChange={(value) => {
                setEmbedState(option.id, value);
                setSearchParams((prev) => {
                  prev.set(option.id, value);
                  prev.set("type", currentEmbed.id);
                  return prev;
                });
              }}
            >
              <SelectTrigger className="w-[210px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {option.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
