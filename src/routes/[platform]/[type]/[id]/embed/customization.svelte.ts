/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  defaultCustomization,
  type Customization,
  getCustomization as getPrimitiveCustom,
} from "$lib/customization.svelte";
import { writable, type Readable } from "svelte/store";
import { getEmbedState } from "./state.svelte";

export function getCustomization(): Readable<Customization> {
  const embedState = getEmbedState();
  let defaultCust = $state.raw(structuredClone(defaultCustomization));
  const cust = writable(structuredClone(defaultCustomization));

  $effect(() => {
    cust.update((cust) => {
      for (const key of Object.keys(defaultCustomization)) {
        if (typeof embedState?.customization?.[key] !== "undefined") {
          (cust as any)[key] = embedState.customization[key];
        } else {
          (cust as any)[key] = (defaultCust as any)[key];
        }
      }
      return cust;
    });
  });

  return {
    subscribe: (run) => {
      const setValue = (c: Partial<Customization>) => {
        const cust = structuredClone(defaultCustomization);
        for (const key of Object.keys(defaultCustomization)) {
          if (typeof (c as any)[key] !== "undefined") {
            (cust as any)[key] = (c as any)[key];
          }
        }
        defaultCust = cust;
      };

      const mainUnsub = getPrimitiveCustom().subscribe(setValue);
      const unsub = cust.subscribe(run);

      return () => {
        unsub();
        mainUnsub();
      };
    },
  };
}
