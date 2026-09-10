import { create } from "zustand";

export type SidebarStore = {
  expandedCategory: string | null;
  openCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
};

export const useSidebarStore = create<SidebarStore>()((set) => ({
  expandedCategory: "cpu",
  openCategory: (id) => {
    set({ expandedCategory: id });
  },
  toggleCategory: (id) => {
    set((state) => ({
      expandedCategory: state.expandedCategory === id ? null : id,
    }));
  },
}));
