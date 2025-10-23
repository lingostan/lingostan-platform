import { Lang } from "@/types/lang/model";
import { create } from "zustand";

interface LangState {
  data: Lang[];

  setData: (langs: Lang[]) => void;
}

export const useLangStore = create<LangState>((set) => ({
  data: [],
  setData: (langs) =>
    set({
      data: langs,
    }),
}));
