import {
  Box,
  CircuitBoard,
  Cpu,
  Gpu,
  HardDrive,
  MemoryStick,
  PlugZap,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { cases } from "@/data/case";
import { cpus } from "@/data/cpu";
import { gpus } from "@/data/gpu";
import { motherboards } from "@/data/motherboard";
import { psus } from "@/data/psu";
import { ramKits } from "@/data/ram";
import { storageDevices } from "@/data/storage";
import type { CompatibleComponent } from "@/data/type";

import { getPartHighlights } from "@/lib/getPartHighlights";
import { specDescriptions } from "@/data/specDescriptions";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarRail,
} from "../sidebar";

type ComponentGroup = {
  name: string;
  id: string;
  icon: LucideIcon;
  items: CompatibleComponent[];
};

const componentGroups: ComponentGroup[] = [
  {
    name: "CPU",
    id: "cpu",
    icon: Cpu,
    items: cpus,
  },
  {
    name: "GPU",
    id: "gpu",
    icon: Gpu,
    items: gpus,
  },
  {
    name: "Motherboard",
    id: "motherboard",
    icon: CircuitBoard,
    items: motherboards,
  },
  {
    name: "Memory",
    id: "ram",
    icon: MemoryStick,
    items: ramKits,
  },
  {
    name: "Storage",
    id: "storage",
    icon: HardDrive,
    items: storageDevices,
  },
  {
    name: "PSU",
    id: "psu",
    icon: PlugZap,
    items: psus,
  },
  {
    name: "Case",
    id: "case",
    icon: Box,
    items: cases,
  },
];

type ComponentSidebarProps = {
  selectedComponent: string;
  onSelectComponent: (componentId: string) => void;

  showCatalog?: boolean;

  selectedPartKey?: string;

  onSelectPart?: (
    part: CompatibleComponent
  ) => void;
};

export function ComponentSidebar({
  selectedComponent,
  onSelectComponent,
  showCatalog = false,
  selectedPartKey,
  onSelectPart,
}: ComponentSidebarProps) {
  const [searchQuery, setSearchQuery] =
    useState("");

  /*
   * Find the currently selected category.
   *
   * If nothing matches for some reason,
   * fall back to CPU.
   */
  const activeGroup =
    componentGroups.find(
      (component) =>
        component.id === selectedComponent,
    ) ?? componentGroups[0];

  /*
   * Search more than just the product name.
   *
   * This means:
   *
   * "corsair"
   * "ddr5"
   * "6000"
   * "cl30"
   * "32gb"
   *
   * can all return useful results.
   */
  const filteredItems = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return activeGroup.items;
    }

    return activeGroup.items.filter((part) => {
      const highlights =
        getPartHighlights(part);

      const searchableText = [
        part.name,
        part.brand,

        ...highlights.flatMap(
          (highlight) => [
            highlight.label,
            highlight.value,
          ],
        ),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [activeGroup, searchQuery]);

  function handleCategoryChange(
    componentId: string,
  ) {
    onSelectComponent(componentId);

    /*
     * Clear the previous category's search.
     *
     * Searching "DDR5" in RAM and then
     * switching to cases shouldn't leave
     * the user staring at an empty catalog.
     */
    setSearchQuery("");
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-border bg-sidebar"
    >
      <SidebarContent className="pt-20 pb-5">
        <SidebarGroup className="px-3">

          {/* SIDEBAR TITLE */}

          <div className="px-1 pb-5">
            <p
              className="text-xl font-semibold tracking-tight font-text text-text"
            >
              Parts
            </p>

            <p
              className="mt-1 text-sm leading-5 font-text text-muted"
            >
              Choose components for your
              system.
            </p>
          </div>

          {/* CATEGORY GRID */}

          <div
            className="grid grid-cols-2 gap-2 "
          >
            {componentGroups.map(
              (component) => {
                const Icon = component.icon;

                const active =
                  selectedComponent ===
                  component.id;

                return (
                  <button
                    key={component.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      handleCategoryChange(
                        component.id,
                      )
                    }
                    className={`
                      group/category
                      flex
                      min-h-16
                      items-center
                      gap-2.5
                      border
                      px-3
                      py-3
                      text-left
                      transition-colors

                      ${
                        active
                          ? `
                            border-accent
                            bg-accent-soft
                            text-text
                          `
                          : `
                            border-border
                            bg-background/30
                            text-muted
                            hover:bg-accent-soft/60
                            hover:text-text
                          `
                      }
                    `}
                  >
                    <Icon
                      className={`
                        size-4
                        shrink-0

                        ${
                          active
                            ? "text-accent-dark"
                            : "text-muted"
                        }
                      `}
                    />

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          font-text
                          text-[13px]
                          font-semibold
                        "
                      >
                        {component.name}
                      </p>

                      <p
                        className="
                          mt-0.5
                          font-text
                          text-[10px]
                          text-muted
                        "
                      >
                        {
                          component.items
                            .length
                        }{" "}
                        parts
                      </p>
                    </div>
                  </button>
                );
              },
            )}
          </div>

          {showCatalog && (
            <section
              className="pt-5 mt-6 border-t border-border"
            >
              {/* ACTIVE CATEGORY HEADER */}

              <div
                className="flex items-end justify-between gap-4 "
              >
                <div>
                  <p
                    className="text-lg font-semibold font-text text-text"
                  >
                    {activeGroup.name}
                  </p>

                  <p
                    className="mt-1 text-xs font-text text-muted"
                  >
                    {filteredItems.length}
                    {filteredItems.length === 1
                      ? " component"
                      : " components"}
                  </p>
                </div>
              </div>

              {/* SEARCH */}

              <div className="relative mt-4">
                <Search
                  aria-hidden="true"
                  className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 size-4 text-muted"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value,
                    )
                  }
                  placeholder={`Search ${activeGroup.name.toLowerCase()}...`}
                  aria-label={`Search ${activeGroup.name}`}
                  className="w-full pl-10 pr-3 text-sm transition-colors border outline-none h-11 border-border bg-background font-text text-text placeholder:text-muted focus:border-accent"
                />
              </div>

              {/* PRODUCTS */}

              <div className="mt-4 space-y-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((part) => {
                    const partKey = `${part.componentType}-${part.id}`;

                    const selected =
                      selectedPartKey ===
                      partKey;

                    const highlights =
                      getPartHighlights(part);

                    return (
                      <button
                        key={partKey}
                        type="button"
                        onClick={() =>
                          onSelectPart?.(part)
                        }
                        className={`
                          group/part
                          w-full
                          border
                          p-4
                          text-left
                          transition-all

                          ${
                            selected
                              ? `
                                border-accent
                                bg-accent-soft
                              `
                              : `
                                border-border
                                bg-background/20
                                hover:border-accent/40
                                hover:bg-accent-soft/40
                              `
                          }
                        `}
                      >
                        {/* NAME + PRICE */}

                        <div
                          className="flex items-start justify-between gap-4 "
                        >
                          <div className="min-w-0">
                            <p
                              className="text-sm font-semibold leading-5 font-text text-text"
                            >
                              {part.name}
                            </p>

                            <p
                              className="mt-1 text-xs font-text text-muted"
                            >
                              {part.brand}
                            </p>
                          </div>

                          <span
                            className={`
                              shrink-0
                              font-mono
                              text-sm
                              font-medium

                              ${
                                selected
                                  ? "text-accent-dark"
                                  : "text-text"
                              }
                            `}
                          >
                            $
                            {part.price.toFixed(
                              2,
                            )}
                          </span>
                        </div>

                        {/* SPEC HIGHLIGHTS */}

                        <div
                          className="
                            mt-3
                            flex
                            flex-wrap
                            gap-1.5
                          "
                        >
                          {highlights.map(
                            (highlight) => (
                              <span
                                key={
                                  highlight.label
                                }
                                title={
                                  specDescriptions[
                                    highlight.label
                                  ] ??
                                  highlight.label
                                }
                                className="
                                  inline-flex
                                  items-center
                                  border
                                  border-border/80
                                  bg-background/70
                                  px-2
                                  py-1.5
                                  font-text
                                  text-[11px]
                                  font-medium
                                  leading-none
                                  text-muted
                                "
                              >
                                {
                                  highlight.value
                                }
                              </span>
                            ),
                          )}
                        </div>

                        {/* SELECTED INDICATOR */}

                        {selected && (
                          <div
                            className="flex items-center gap-2 pt-3 mt-3 border-t border-accent/20"
                          >
                            <span
                              className="
                                size-1.5
                                bg-accent
                              "
                            />

                            <span
                              className="text-xs font-medium font-text text-accent-dark"
                            >
                              Selected
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  /* SEARCH EMPTY STATE */

                  <div
                    className="px-4 py-8 text-center border border-dashed border-border"
                  >
                    <p
                      className="text-sm font-medium font-text text-text"
                    >
                      No components found
                    </p>

                    <p
                      className="mt-1 text-xs font-text text-muted"
                    >
                      Try a different search.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail aria-label="Toggle parts sidebar" />
    </Sidebar>
  );
}