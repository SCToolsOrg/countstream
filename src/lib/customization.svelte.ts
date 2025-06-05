/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from "$app/environment";
import { page } from "$app/state";
import { getContext, setContext } from "svelte";
import { writable, type Readable, type Subscriber } from "svelte/store";

export interface Customization {
  banner: boolean;
  avatar: boolean;
  platformIcon: boolean;
  name: boolean;
  username: boolean;
  countName: boolean;
  countIcon: boolean;
  sideCounts: boolean;
  graph: boolean;
  fontFamily: string;
  countFontFamily: string;
  countFontWeight: number;
  odometerSpeed: number;
  backgroundColor?: string;
  cardColor?: string;
  countColor?: string;
  odometerUpColor?: string;
  odometerDownColor?: string;
  animateOdometerColor: boolean;
}

export const defaultCustomization: Customization = {
  banner: false,
  avatar: true,
  platformIcon: true,
  name: true,
  username: true,
  countName: true,
  countIcon: true,
  sideCounts: true,
  graph: true,
  fontFamily: '"DM Sans Variable", "DM Sans", sans-serif',
  countFontFamily: '"Roboto Variable", "Roboto", sans-serif',
  countFontWeight: 400,
  odometerSpeed: 2,
  backgroundColor: "#171521",
  cardColor: "#252331",
  countColor: "#ffffff",
  odometerUpColor: undefined,
  odometerDownColor: undefined,
  animateOdometerColor: false,
};

export function getKey(key = "global") {
  let newKey = (key !== "global" ? key.slice(1) : key).replace(/\//g, ":");
  if (newKey.length === 0) newKey = "home";
  return newKey;
}

export const setCustomizationStore = (type: "global" | "page" = "global") => {
  const key = type === "global" ? "global" : getKey(page.url.pathname);
  const store = new CustomizationStore(`countstream:customization:${key}`);
  return setContext(`customization:${type}`, store);
};

export const customization = (type: "global" | "page" = "global") =>
  getContext<CustomizationStore>(`customization:${type}`);

export function getCustomization(): Readable<Customization> {
  const cust = writable(defaultCustomization);

  return {
    subscribe: (run) => {
      const setValue = (c: Partial<Customization>) => {
        cust.update(() => {
          const cust = structuredClone(defaultCustomization);
          for (const key of Object.keys(defaultCustomization)) {
            if (typeof (c as any)[key] !== "undefined") {
              (cust as any)[key] = (c as any)[key];
            }
          }
          return cust;
        });
      };

      const globalUnsub = customization().subscribe(setValue);
      // const pageUnsub = customization("page").subscribe(setValue);
      const unsub = cust.subscribe(run);

      return () => {
        unsub();
        globalUnsub();
        // pageUnsub();
      };
    },
  };
}

class CustomizationStore {
  private _data = writable<Partial<Customization>>({});
  key: string;

  constructor(key: string) {
    this.key = key;
    this.initializeData();
  }

  initializeData() {
    if (!browser) return;

    const localValue = localStorage.getItem(this.key);
    if (localValue) {
      this._data.set(JSON.parse(localValue));
    } else {
      this._data.set({});
    }
  }

  subscribe(run: Subscriber<Partial<Customization>>) {
    const updateValueOnChange = (event: StorageEvent) => {
      if (event.key === this.key) {
        if (event.newValue) {
          this._data.set(JSON.parse(event.newValue));
        } else {
          this._data.set({});
        }
      }
    };

    window.addEventListener("storage", updateValueOnChange);

    const unsub = this._data.subscribe(run);
    return () => {
      unsub();
      window.removeEventListener("storage", updateValueOnChange);
    };
  }

  set(value: Partial<Customization>) {
    this._data.set(value);
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  update<K extends keyof Customization>(key: K, value: Customization[K]) {
    this._data.update((customization) => {
      customization[key] = value;
      localStorage.setItem(this.key, JSON.stringify(customization));
      return customization;
    });
  }

  reset<K extends keyof Customization>(key: K) {
    this._data.update((customization) => {
      customization[key] = undefined;
      localStorage.setItem(this.key, JSON.stringify(customization));
      return customization;
    });
  }
}
