import type { BUILD, Category } from "@/data/type";
import { create } from "zustand";

type BuildStore = {
  build: BUILD;
  setBuild: (update: BuildUpdate) => void;
  setPart:<K extends Category> (category: K, part: BUILD[K]) => void;
};

type BuildUpdate = BUILD | ((previous: BUILD) => BUILD)

export const useBuildStore = create<BuildStore>((set) => ({
    build: {
        STORAGE: [],
    },
    
    setBuild: (update) =>
        set((state) => ({
            build: typeof update === "function"
            ? update(state.build)
            : update,
        })),
        
        setPart: (category, part) => {
            set((state) => ({
                build: {
                    ...state.build,
                    [category]: part,
                }
            }))
        }
    }))
    
