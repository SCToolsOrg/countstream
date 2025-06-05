<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button, type ButtonProps } from "../ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import {
    customization,
    defaultCustomization,
    type Customization,
  } from "$lib/customization.svelte";
  import { Switch } from "$lib/components/ui/switch";
  import * as Tabs from "$lib/components/ui/tabs";
  import ColorPicker from "svelte-awesome-color-picker";

  const buttonProps: ButtonProps = $props();

  let currentTab = $state("global");

  const globalCustomization = customization();
  const pageCustomization = customization("page");
</script>

{#snippet customToggle(label: string, key: keyof Customization)}
  <div class="flex items-center space-x-2">
    <Switch
      id={label}
      bind:checked={
        () =>
          ((currentTab === "global"
            ? $globalCustomization
            : $pageCustomization)[key] ?? defaultCustomization[key]) as boolean,
        (value) => {
          (currentTab === "global"
            ? globalCustomization
            : pageCustomization
          ).update(key, value);
        }
      }
    />
    <Label for={label}>{label}</Label>
  </div>
{/snippet}

{#snippet customInput(label: string, key: keyof Customization)}
  <div class="space-y-1.5">
    <Label for={label}>{label}</Label>
    <div class="flex items-center gap-3">
      <Input
        id={label}
        bind:value={
          () =>
            (currentTab === "global"
              ? $globalCustomization
              : $pageCustomization)[key] ?? defaultCustomization[key],
          (value) => {
            (currentTab === "global"
              ? globalCustomization
              : pageCustomization
            ).update(key, value);
          }
        }
      />
      <Button
        onclick={() => {
          (currentTab === "global"
            ? globalCustomization
            : pageCustomization
          ).reset(key);
        }}>Reset</Button
      >
    </div>
  </div>
{/snippet}

{#snippet customColorInput(label: string, key: keyof Customization)}
  <div class="space-y-1.5">
    <Label for={label}>{label}</Label>
    <div class="flex items-center gap-3">
      <ColorPicker
        label=""
        bind:hex={
          () =>
            ((currentTab === "global"
              ? $globalCustomization
              : $pageCustomization)[key] ??
              defaultCustomization[key] ??
              "#000") as string,
          (value) => {
            (currentTab === "global"
              ? globalCustomization
              : pageCustomization
            ).update(key, value);
          }
        }
      />
      <Input
        id={label}
        bind:value={
          () =>
            (currentTab === "global"
              ? $globalCustomization
              : $pageCustomization)[key] ?? defaultCustomization[key],
          (value) => {
            (currentTab === "global"
              ? globalCustomization
              : pageCustomization
            ).update(key, value);
          }
        }
      />
      <Button
        onclick={() => {
          (currentTab === "global"
            ? globalCustomization
            : pageCustomization
          ).reset(key);
        }}>Reset</Button
      >
    </div>
  </div>
{/snippet}

<Dialog.Root>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button {...buttonProps} {...props} variant="outline"
        >Customization</Button
      >
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content
    class="max-h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] !max-w-180 overflow-auto"
  >
    <Dialog.Header>
      <Dialog.Title>Customization</Dialog.Title>
    </Dialog.Header>
    <Tabs.Root bind:value={currentTab}>
      <Tabs.List class="w-full">
        <Tabs.Trigger value="global">Global</Tabs.Trigger>
        <Tabs.Trigger value="page">This page</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
    <div class="grid h-full grid-cols-1 gap-3 md:grid-cols-4">
      <div class="space-y-2">
        {@render customToggle("Banner", "banner")}
        {@render customToggle("Avatar", "avatar")}
        {@render customToggle("Platform Icon", "platformIcon")}
        {@render customToggle("Name", "name")}
        {@render customToggle("Username", "username")}
        {@render customToggle("Count Name", "countName")}
        {@render customToggle("Count Icon", "countIcon")}
        {@render customToggle("Side Counts", "sideCounts")}
        {@render customToggle("Graph", "graph")}
      </div>
      <div class="col-span-3 space-y-2">
        {@render customInput("Text Font", "fontFamily")}
        {@render customInput("Count Font", "countFontFamily")}
        {@render customInput("Count Font Weight", "countFontWeight")}
        {@render customInput("Odometer Speed", "odometerSpeed")}
        {@render customColorInput("Background Color", "backgroundColor")}
        {@render customColorInput("Card Color", "cardColor")}
        {@render customColorInput("Count Color", "countColor")}
        {@render customColorInput("Odometer Up Color", "odometerUpColor")}
        {@render customColorInput("Odometer Down Color", "odometerDownColor")}
        {@render customToggle("Animate Odometer Color", "animateOdometerColor")}
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>

<style global>
  :root {
    --cp-bg-color: var(--background);
    --cp-border-color: var(--border);
    --cp-text-color: var(--foreground);
    --cp-input-color: var(--input);
    --cp-button-hover-color: var(--accent);
    --focus-color: var(--border);
  }
</style>
