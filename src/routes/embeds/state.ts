import { map } from "nanostores";
import { useStore } from "@nanostores/react";
import { useSearchParams } from "react-router";

const $globalState = map<Record<string, string>>({});

export function useEmbedState(key: string, defaultValue: string) {
  const [searchParams] = useSearchParams();
  const store = useStore($globalState);
  if (!store[key]) {
    const value = searchParams.get(key) ?? defaultValue;
    $globalState.setKey(key, value);
    return store[key];
  } else return store[key];
}

export function getEmbedState(key: string) {
  return $globalState.get()[key];
}

export function setEmbedState(key: string, value: string) {
  $globalState.setKey(key, value);
}
