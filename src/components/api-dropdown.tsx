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
      <DropdownMenuTrigger className="flex w-[240px] items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
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
      onClick={() => setApi(api.id)}
      className="justify-between gap-0"
    >
      <div className="flex items-center gap-1.5">
        <p>{api.name}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <Info className="h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm border text-center text-foreground">
              {api.description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-1">
        {!api.stable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default rounded-sm bg-red-950 p-1 text-red-500">
                <Cog className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm border text-center text-foreground">
                Not very stable. May not work or be slow sometimes.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {api.accurate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default rounded-sm bg-yellow-950 p-1 text-yellow-500">
                <ChartLine className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm border text-center text-foreground">
                Very accurate estimations
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {recommendedApi === api.id && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-default rounded-sm bg-green-950 p-1 text-green-500">
                <Sparkles className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm border text-center text-foreground">
                Recommended API for {name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </DropdownMenuItem>
  );
}
