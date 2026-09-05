import { useState } from "react";
import {
  Box,
  ChevronRight,
  CircuitBoard,
  Cpu,
  Fan,
  Gpu,
  HardDrive,
  MemoryStick,
  PlugZap,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// These arrays are the project's current local catalog dependency. Importing
// them directly keeps the MVP transparent and avoids introducing a database or
// network layer before the product-selection flow is complete.
import { cases } from "@/data/case";
import { cpus } from "@/data/cpu";
import { gpus } from "@/data/gpu";
import { motherboards } from "@/data/motherboard";
import { psus } from "@/data/psu";
import { ramKits } from "@/data/ram";
import { storageDevices } from "@/data/storage";
import type { CompatibleComponent } from "@/data/type";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../sidebar";

/** Normalized view of differently typed product arrays for sidebar rendering. */
type ComponentGroup = {
  name: string;
  id: string;
  icon: LucideIcon;
  items: CompatibleComponent[];
};

// One adapter table drives labels, icons, IDs, and product collections. This
// prevents eight copied conditional branches from drifting apart. Cooling is
// deliberately empty because no cooling dataset exists yet; the UI reports
// that honestly instead of fabricating products.
const componentGroups: ComponentGroup[] = [
  { name: "CPU", id: "cpu", icon: Cpu, items: cpus },
  { name: "GPU", id: "gpu", icon: Gpu, items: gpus },
  {
    name: "MOTHERBOARD",
    id: "motherboard",
    icon: CircuitBoard,
    items: motherboards,
  },
  { name: "MEMORY", id: "ram", icon: MemoryStick, items: ramKits },
  {
    name: "STORAGE",
    id: "storage",
    icon: HardDrive,
    items: storageDevices,
  },
  { name: "COOLING", id: "cooler", icon: Fan, items: [] },
  { name: "PSU", id: "psu", icon: PlugZap, items: psus },
  { name: "CASE", id: "case", icon: Box, items: cases },
];

/**
 * Inputs shared by the compact Home index and expandable Build catalog.
 * Optional catalog props let Home reuse the category navigation without owning
 * product-inspection state that only exists on Build.
 */
type ComponentSidebarProps = {
  selectedComponent: string;
  onSelectComponent: (componentId: string) => void;
  showCatalog?: boolean;
  selectedPartKey?: string;
  onSelectPart?: (part: CompatibleComponent) => void;
};

/**
 * Renders a collapsible component-category index and optional product catalog.
 *
 * @param {ComponentSidebarProps} props - Controlled category state, optional
 * product-selection state, and callbacks owned by the surrounding page.
 * @returns {JSX.Element} A shadcn sidebar that can slide fully off canvas.
 * @throws {Error} Throws when rendered outside `SidebarProvider`, because the
 * underlying sidebar primitives require that React context.
 */
export function ComponentSidebar({
  selectedComponent,
  onSelectComponent,
  showCatalog = false,
  selectedPartKey,
  onSelectPart,
}: ComponentSidebarProps) {
  // Expansion is intentionally local UI state: changing which accordion is open
  // should not pollute the application build state or URL.
  const [expandedComponent, setExpandedComponent] = useState<string | null>(
    showCatalog ? selectedComponent : null,
  );

  /**
   * Reports the active category and, when enabled, toggles its product list.
   *
   * @param {string} componentId - Stable lowercase ID of the clicked group.
   * @returns {void}
   * @remarks Callback errors from the parent are allowed to propagate so React
   * can surface them rather than leaving sidebar and page state inconsistent.
   */
  function handleGroupClick(componentId: string) {
    // The parent owns selection because the viewport and footer also consume it.
    onSelectComponent(componentId);

    if (showCatalog) {
      // A single active group reduces sidebar height and makes closing an open
      // group possible by clicking its heading again.
      setExpandedComponent((current) =>
        current === componentId ? null : componentId,
      );
    }
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-border bg-sidebar"
    >
      <SidebarContent className="pt-20">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-5 font-mono text-[10px] tracking-[0.25em] text-muted">
            PART INDEX / 01
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1">
            {componentGroups.map((component) => {
              // Component constructors must begin with a capital letter before
              // React can render the icon stored in data as JSX.
              const Icon = component.icon;
              const active = selectedComponent === component.id;
              const expanded = expandedComponent === component.id;

              return (
                <SidebarMenuItem key={component.id}>
                  <SidebarMenuButton
                    type="button"
                    aria-expanded={showCatalog ? expanded : undefined}
                    isActive={active}
                    onClick={() => handleGroupClick(component.id)}
                    className="relative h-11 rounded-none border-l-2 border-transparent font-mono text-xs tracking-[0.15em] text-muted hover:bg-accent-soft hover:text-text data-[active=true]:border-accent data-[active=true]:bg-accent-soft data-[active=true]:text-accent-dark"
                  >
                    <Icon className="size-4" />
                    <span>{component.name}</span>
                    {showCatalog && (
                      <ChevronRight
                        aria-hidden="true"
                        className={`ml-auto size-3 transition-transform duration-200 ${
                          expanded ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </SidebarMenuButton>

                  <AnimatePresence initial={false}>
                    {showCatalog && expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.22,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 max-h-72 overflow-y-auto border-l border-border py-1 pl-2">
                          {component.items.length > 0 ? (
                            component.items.map((part) => {
                              // IDs are unique only inside each catalog file, so
                              // the type is required to avoid React key collisions.
                              const partKey = `${part.componentType}-${part.id}`;
                              const selected = selectedPartKey === partKey;

                              return (
                                // Optional chaining is required because Home
                                // intentionally renders no product callback.
                                <button
                                  key={partKey}
                                  type="button"
                                  onClick={() => onSelectPart?.(part)}
                                  className={`group/part w-full border-b border-border/60 px-2 py-3 text-left transition-colors last:border-b-0 hover:bg-accent-soft ${
                                    selected ? "bg-accent-soft" : ""
                                  }`}
                                >
                                  <span className="block truncate font-text text-xs font-medium text-text">
                                    {part.name}
                                  </span>
                                  <span className="mt-1 flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                                    <span>{part.brand}</span>
                                    <span
                                      className={
                                        selected ? "text-accent-dark" : ""
                                      }
                                    >
                                      ${part.price.toFixed(2)}
                                    </span>
                                  </span>
                                </button>
                              );
                            })
                          ) : (
                            // An explicit empty state distinguishes unavailable
                            // data from a broken accordion or loading failure.
                            <p className="px-2 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                              Catalog pending
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* The edge rail provides a large, discoverable desktop collapse target
          in addition to the header trigger used to reopen the sidebar. */}
      <SidebarRail aria-label="Toggle part index" />
    </Sidebar>
  );
}
