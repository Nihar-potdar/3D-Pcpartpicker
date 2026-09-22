import type { DetailedErrors } from "@/data/type"
import { create } from "zustand";

type IssueStore = {
    CompatiblityIssues: DetailedErrors[];
    setCompatiblityIssues: (update: IssuesUpdate) => void;
    clearCompatiblityIssues: () => void;
}

type IssuesUpdate = DetailedErrors[] | ((previous: DetailedErrors[]) => DetailedErrors[])

export const useIssueStore = create<IssueStore>((set) => ({
    CompatiblityIssues: [],

    setCompatiblityIssues: (update) =>
        set((state) => ({
            CompatiblityIssues: typeof update === "function"
            ? update(state.CompatiblityIssues)
            : update,
        })),

    clearCompatiblityIssues: () =>
        set({
            CompatiblityIssues: [],
        })
}))