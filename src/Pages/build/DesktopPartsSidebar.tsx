import { AlertTriangle, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { BUILD, CompatibleComponent, DetailedErrors } from "@/data/type";
import { getPartHighlights } from "@/lib/getPartHighlights";
import { componentKey } from "@/Logic/Compatibility/CandidateCompatibility";

import { componentGroups } from "./buildCatalog";
import {
  CompatibilityFilterToggle,
  type CompatibilityFilterMode,
} from "./CompatibilityFilterToggle";

type DesktopPartsSidebarProps = {
  catalogCategory: string;
  filteredParts: CompatibleComponent[];
  selectedPartKey?: string;
  build: BUILD;
  onOpenCategory: (category: string) => void;
  onChooseProduct: (part: CompatibleComponent) => void;
  onAddStorage: (part: CompatibleComponent) => void;
  candidateIssues: ReadonlyMap<string, DetailedErrors[]>;
  compatibilityFilter: CompatibilityFilterMode;
  onCompatibilityFilterChange: (value: CompatibilityFilterMode) => void;
};

export function DesktopPartsSidebar({
  catalogCategory,
  filteredParts,
  selectedPartKey,
  build,
  onOpenCategory,
  onChooseProduct,
  onAddStorage,
  candidateIssues,
  compatibilityFilter,
  onCompatibilityFilterChange,
}: DesktopPartsSidebarProps) {
  return (
    <aside className="hidden min-h-0 w-[350px] shrink-0 flex-col overflow-hidden border-r border-border bg-surface lg:flex">
      <div className="shrink-0 border-b border-border bg-border">
        <div className="grid grid-cols-2 gap-px">
          {componentGroups.map((component, index) => {
            const Icon = component.icon;
            const active = component.id === catalogCategory;

            return (
              <motion.button
                key={component.id}
                type="button"
                onClick={() => onOpenCategory(component.id)}
                whileTap={{ scale: 0.98 }}
                className={`group relative flex min-h-[58px] items-center gap-3 overflow-hidden px-4 py-3 text-left transition-colors ${
                  active
                    ? "text-white"
                    : "bg-surface text-muted hover:bg-background hover:text-text"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="active-category"
                    className="absolute inset-0 bg-accent"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}

                <span
                  className={`relative z-10 shrink-0 font-mono text-[8px] tracking-[0.18em] ${
                    active ? "text-white/60" : "text-muted/60"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <Icon
                  className={`relative z-10 size-4 shrink-0 ${
                    active ? "text-white" : "text-muted group-hover:text-text"
                  }`}
                />

                <span className="relative z-10 min-w-0 truncate font-display text-sm font-bold italic uppercase tracking-wide">
                  {component.id === "motherboard" ? "MB" : component.name}
                </span>

                {active && (
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 z-10 h-[2px] origin-left bg-white/70"
                  />
                )}
              </motion.button>
            );
          })}

          {componentGroups.length % 2 !== 0 && (
            <div aria-hidden="true" className="min-h-[58px] bg-surface" />
          )}
        </div>
      </div>

      <div className="shrink-0 border-b border-border p-3">
        <CompatibilityFilterToggle
          value={compatibilityFilter}
          onChange={onCompatibilityFilterChange}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <AnimatePresence mode="popLayout">
          {filteredParts.map((part, index) => {
            const key = `${part.componentType}-${part.id}`;
            const issues = candidateIssues.get(componentKey(part)) ?? [];
            const isCompatible = issues.length === 0;
            const selected =
              part.componentType === "Storage"
                ? build.STORAGE.some((drive) => drive.product.id === part.id)
                : selectedPartKey === key;
            const specs = getPartHighlights(part)
              .slice(0, 4)
              .map((item) => item.value);

            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: selected ? 5 : 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.16 }}
              >
                <motion.button
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${selected ? "Remove" : "Select"} ${part.name}`}
                  onClick={() => onChooseProduct(part)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.12 }}
                  className={`relative w-full border-l-2 px-4 py-4 text-left [@media(max-height:800px)]:py-3 [@media(max-height:700px)]:py-2 ${
                    selected
                      ? "accent-glow border-accent bg-background"
                      : !isCompatible
                        ? "border-danger/60 bg-danger/5 hover:bg-danger/10"
                      : "border-transparent hover:border-accent/40 hover:bg-background/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                        PART_{String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 text-base italic font-bold uppercase leading-5 font-display [@media(max-height:700px)]:text-sm">
                        {part.name}
                      </p>
                      <p className="mt-1 text-xs text-muted">{part.brand}</p>
                    </div>

                    {selected && (
                      <span className="grid size-6 shrink-0 place-items-center bg-accent text-white">
                        <Check className="size-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="mt-3 font-mono text-[9px] uppercase leading-5 text-muted [@media(max-height:800px)]:mt-2 [@media(max-height:700px)]:hidden">
                    {specs.join(" / ")}
                  </p>

                  {!isCompatible && (
                    <div className="mt-2 flex items-center gap-1.5 text-danger">
                      <AlertTriangle className="size-3.5 shrink-0" />
                      <span className="font-mono text-[8px] font-bold uppercase tracking-wider">
                        {issues.length} compatibility {issues.length === 1 ? "issue" : "issues"}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex items-end justify-between [@media(max-height:800px)]:mt-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
                      {part.componentType === "Storage"
                        ? `${
                            build.STORAGE.filter(
                              (drive) => drive.product.id === part.id,
                            ).length
                          } installed`
                        : selected
                          ? "Remove"
                          : "Select"}
                    </span>
                    <span className="font-mono text-sm font-bold">
                      ${part.price.toFixed(2)}
                    </span>
                  </div>
                </motion.button>

                {part.componentType === "Storage" && selected && (
                  <button
                    type="button"
                    onClick={() => onAddStorage(part)}
                    className="min-h-11 w-full border-b border-border px-4 py-2 text-left font-mono text-[10px] uppercase text-accent-dark hover:bg-accent-soft"
                  >
                    + Add another
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </aside>
  );
}
