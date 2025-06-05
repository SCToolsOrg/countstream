import type { Count } from "$lib/counts";

type EmbedState = {
  count: Count;
  countIndex: number;
  counts: () => number[];
  info: Exclude<Awaited<ReturnType<Count["getInfo"]>>, null>;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let embedState = $state<EmbedState>({} as any);

export const getEmbedState = () => embedState;
export const setEmbedState = (newState: EmbedState) => (embedState = newState);
export const updateEmbedState = (run: (value: EmbedState) => EmbedState) => {
  embedState = run(embedState);
};
