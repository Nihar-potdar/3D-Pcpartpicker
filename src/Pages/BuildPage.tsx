import { useState } from "react";
import { motion, MotionConfig } from "motion/react";

import { BuildViewport } from "@/components/BuildViewport";
import { NavBar } from "@/components/NavBar";
import { ComponentSidebar } from "@/components/ui/Nav/ComponentSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { CompatibleComponent } from "@/data/type";

// Catalog IDs are deliberately translated at the page boundary. The sidebar
// can keep stable data-oriented keys while the viewport uses more atmospheric,
// user-facing names without changing the underlying component data.
const categoryNames: Record<string, string> = {
  cpu: "Processor bay",
  gpu: "Graphics bay",
  motherboard: "Mainboard tray",
  ram: "Memory bank",
  storage: "Storage array",
  cooler: "Cooling loop",
  psu: "Power chamber",
  case: "Chassis frame",
};

/**
 * Composes the interactive PC-building workspace.
 *
 * At this stage, a selected product is inspection state rather than a complete
 * saved build. Keeping those concepts separate avoids accidentally presenting
 * a single inspected part as a persisted or compatibility-validated build.
 *
 * @returns {JSX.Element} The open part catalog and full-size 3D viewport shell.
 * @remarks This component does not intentionally throw. Rendering failures from
 * the sidebar, Motion, or WebGL canvas propagate to React's error boundary.
 */
export function BuildPage() {
  // Category state controls which catalog group and viewport label are active.
  const [selectedComponent, setSelectedComponent] = useState("cpu");
  // Product state is nullable because the user can inspect a category before
  // choosing a specific product from it.
  const [selectedPart, setSelectedPart] = useState<CompatibleComponent | null>(
    null,
  );

  // IDs restart inside different data files, so componentType is included to
  // create a collision-free UI key such as "CPU-1" versus "GPU-1".
  const selectedPartKey = selectedPart
    ? `${selectedPart.componentType}-${selectedPart.id}`
    : undefined;

  /**
   * Switches catalog context and clears an inspection that no longer belongs
   * to the visible category.
   *
   * @param {string} componentId - Stable sidebar ID such as `cpu` or `storage`.
   * @returns {void}
   * @remarks This state-only handler does not intentionally throw.
   */
  function selectComponent(componentId: string) {
    setSelectedComponent(componentId);
    // Clearing prevents a GPU name, for example, from remaining visible after
    // the user changes the viewport context to a motherboard bay.
    setSelectedPart(null);
  }

  return (
    <MotionConfig reducedMotion="user">
      {/* Builders need the catalog immediately; Home deliberately overrides
          this provider default and begins with the sidebar collapsed. */}
      <SidebarProvider
        defaultOpen
        className="h-dvh min-h-dvh overflow-hidden bg-background text-text"
      >
        <ComponentSidebar
          selectedComponent={selectedComponent}
          onSelectComponent={selectComponent}
          showCatalog
          selectedPartKey={selectedPartKey}
          onSelectPart={setSelectedPart}
        />

        <SidebarInset className="min-h-0 overflow-hidden bg-background">
          <NavBar variant="build" />

          <motion.div
            initial={{ opacity: 0, scale: 0.992 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-5"
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border pb-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent-dark">
                  Build workspace
                </p>
                <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-text sm:text-3xl">
                  Assemble your system.
                </h1>
              </div>

              <div className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted sm:flex">
                <span className="size-1.5 rounded-full bg-accent" />
                Viewport ready
              </div>
            </div>

            <BuildViewport
              selectedCategory={
                // The fallback keeps the UI resilient if a new catalog group is
                // added before its friendlier viewport name is written.
                categoryNames[selectedComponent] ?? selectedComponent
              }
              selectedPart={selectedPart}
            />
          </motion.div>
        </SidebarInset>
      </SidebarProvider>
    </MotionConfig>
  );
}
