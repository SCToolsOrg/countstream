import { API, apis } from "@/hooks/use-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  ChartLine,
  ChevronDown,
  ChevronUp,
  Cog,
  Info,
  Sparkles,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function ApiDropdown({
  name,
  selectedApi,
  setApi,
  recommendedApi,
}: {
  name: string;
  selectedApi: API;
  recommendedApi: string;
  setApi: (api: string) => void;
}) {
  const [apiDropdownOpen, setApiDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={apiDropdownOpen} onOpenChange={setApiDropdownOpen}>
      <DropdownMenuTrigger className="flex items-center justify-between w-[240px] bg-card border px-3 py-2 rounded-lg text-sm">
        <span>{selectedApi.name}</span>
        {apiDropdownOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:w-64">
        <DropdownMenuLabel>Stable APIs</DropdownMenuLabel>
        {apis
          .filter((api) => api.stable)
          .map((api) => (
            <ApiItem
              key={api.id}
              name={name}
              api={api}
              setApi={setApi}
              recommendedApi={recommendedApi}
            />
          ))}
        <DropdownMenuLabel>Unstable/Experimental APIs</DropdownMenuLabel>
        {apis
          .filter((api) => !api.stable)
          .map((api) => (
            <ApiItem
              key={api.id}
              name={name}
              api={api}
              setApi={setApi}
              recommendedApi={recommendedApi}
            />
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ApiItem({
  name = "",
  api,
  setApi,
  recommendedApi,
}: {
  name?: string;
  api: API;
  setApi: (id: string) => void;
  recommendedApi: string;
}) {
  return (
    <DropdownMenuItem
      onClick={() => !api.down && setApi(api.id)}
      className={cn("justify-between gap-0", api.down && "opacity-50")}
    >
      <div className="flex items-center gap-1.5">
        <p>{api.name}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <Info className="h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent className="bg-card text-foreground border max-w-sm text-center">
              {api.description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-1">
        {!api.stable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default p-1 bg-red-950 text-red-500 rounded-sm">
                <Cog className="w-3 h-3" />
              </TooltipTrigger>
              <TooltipContent className="bg-card text-foreground border max-w-sm text-center">
                Not very stable. May not work or be slow sometimes.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {api.accurate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default p-1 bg-yellow-950 text-yellow-500 rounded-sm">
                <ChartLine className="w-3 h-3" />
              </TooltipTrigger>
              <TooltipContent className="bg-card text-foreground border max-w-sm text-center">
                Very accurate estimations
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {recommendedApi === api.id && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default p-1 bg-green-950 text-green-500 rounded-sm">
                <Sparkles className="w-3 h-3" />
              </TooltipTrigger>
              <TooltipContent className="bg-card text-foreground border max-w-sm text-center">
                Recommended API for {name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </DropdownMenuItem>
  );
}
