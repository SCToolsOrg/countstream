<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { convertPlatformToName, counts, type Count } from "$lib/counts";

  const countsByPlatform = Object.values(
    counts.reduce(
      (acc, obj) => {
        acc[obj.platform] ??= {
          name: obj.platform,
          icon: obj.icon,
          color: obj.color,
          counts: [],
        };
        acc[obj.platform].counts.push(obj);
        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          icon: string;
          color: string;
          counts: Count[];
        }
      >
    )
  );
</script>

<div class="space-y-4">
  <div class="space-y-1">
    <div class="flex items-end justify-center gap-1 text-center">
      <h1 class="text-4xl font-bold tracking-tighter">
        count<span class="text-primary">stream</span>
      </h1>
      <sub class="text-muted-foreground mb-3.5">by SCTools</sub>
    </div>
    <p class="text-center text-sm">
      The live count website made for streamers by streamers.
    </p>
  </div>
  <div
    class="grid grid-cols-1 justify-center gap-2 md:grid-cols-2 lg:grid-cols-3"
  >
    {#each countsByPlatform as platform (platform.name)}
      <Card
        class="flex flex-col items-center gap-1 overflow-hidden text-center"
      >
        <img
          src={platform.icon}
          alt={platform.name}
          width={64}
          height={64}
          class="z-50 h-16 object-contain"
        />
        <h1 class="text-xl font-bold tracking-tight">
          {convertPlatformToName(platform.name)}
        </h1>
        {#each platform.counts as count (count.type)}
          <a
            href={`${platform.name}/${count.type}`}
            class="hover:text-primary transition-colors"
          >
            {count.name}
          </a>
        {/each}
      </Card>
    {/each}
  </div>
</div>
