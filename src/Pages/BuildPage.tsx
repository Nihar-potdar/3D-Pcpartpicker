import {
  Box,
  Check,
  CircuitBoard,
  Cpu,
  Gpu,
  HardDrive,
  MemoryStick,
  PlugZap,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useDragControls,
} from "motion/react";
import { toast } from "sonner";

import { BuildViewport } from "@/components/BuildViewport";
import { NavBar } from "@/components/NavBar";

import { cases } from "@/data/case";
import { cpus } from "@/data/cpu";
import { gpus } from "@/data/gpu";
import { motherboards } from "@/data/motherboard";
import { psus } from "@/data/psu";
import { ramKits } from "@/data/ram";
import { storageDevices } from "@/data/storage";

import type {
  BUILD,
  Category,
  CompatibleComponent,
  InstalledDrive,
  SavedBuild,
} from "@/data/type";

import {
  buildToComponents,
  getDetailedErrors,
  validateBuild,
} from "@/Logic/Compatibility/Compatibility";
import { savedBuildListSchema } from "@/zod/buildSchema";
import { useBuildStore } from "@/stores/BuildStore";
import { getPartHighlights } from "@/lib/getPartHighlights";

type ComponentGroup = {
  id: string;
  name: string;
  label: string;
  icon: LucideIcon;
  items: CompatibleComponent[];
};

const componentGroups: ComponentGroup[] = [
  { id: "cpu", name: "CPU", label: "Processor", icon: Cpu, items: cpus },
  { id: "gpu", name: "GPU", label: "Graphics", icon: Gpu, items: gpus },
  {
    id: "motherboard",
    name: "MOTHERBOARD",
    label: "Motherboard",
    icon: CircuitBoard,
    items: motherboards,
  },
  {
    id: "ram",
    name: "MEMORY",
    label: "Memory",
    icon: MemoryStick,
    items: ramKits,
  },
  {
    id: "storage",
    name: "STORAGE",
    label: "Storage",
    icon: HardDrive,
    items: storageDevices,
  },
  {
    id: "psu",
    name: "POWER",
    label: "Power supply",
    icon: PlugZap,
    items: psus,
  },
  { id: "case", name: "CASE", label: "Case", icon: Box, items: cases },
];

const categoryNames: Record<string, string> = {
  cpu: "Processor bay",
  gpu: "Graphics bay",
  motherboard: "Mainboard tray",
  ram: "Memory bank",
  storage: "Storage array",
  psu: "Power chamber",
  case: "Chassis frame",
};

type MobilePartsPanelProps = {
  activeGroup: ComponentGroup;
  filteredParts: CompatibleComponent[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedPartKey?: string;
  installedDrives: InstalledDrive[];
  chooseProduct: (part: CompatibleComponent) => void;
  addStorage: (part: CompatibleComponent) => void;
};

function PullDownToClose({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const startY = useRef(0);
  const pulling = useRef(false);

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const element = event.currentTarget;

    if (element.scrollTop <= 0) {
      startY.current = event.touches[0].clientY;
      pulling.current = true;
    } else {
      pulling.current = false;
    }
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (!pulling.current) return;

    const element = event.currentTarget;

    //User started scrolling the list normally
    if (element.scrollTop > 0) {
      pulling.current = false;
      return;
    }

    const currentY = event.touches[0].clientY;
    const distance = currentY - startY.current;

    // Only dismiss on a deliberate downward pull.
    if (distance <= 0) return;

    if (distance > 45) {
      pulling.current = false;
      onClose();
    }
  }

  function handleTouchEnd() {
    pulling.current = false;
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
    >
      {children}
    </div>
  );
}

function MobilePartsPanel({
  activeGroup,
  filteredParts,
  searchQuery,
  setSearchQuery,
  selectedPartKey,
  installedDrives,
  chooseProduct,
  addStorage,
}: MobilePartsPanelProps) {
  return (
    <>
      <div className="relative px-4 py-3 shrink-0">
        <Search className="absolute -translate-y-1/2 left-7 top-1/2 size-4 text-muted" />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={`SEARCH ${activeGroup.name}`}
          className="h-11 w-full border border-border bg-surface pl-10 pr-3 font-mono text-[10px] uppercase tracking-wide outline-none placeholder:text-muted focus:border-accent"
        />
      </div>

      <div className="px-3 pb-5">
        <AnimatePresence mode="popLayout">
          {filteredParts.map((part, index) => {
            const key = `${part.componentType}-${part.id}`;
            const selected =
              part.componentType === "Storage"
                ? installedDrives.some((drive) => drive.product.id === part.id)
                : selectedPartKey === key;
            const specs = getPartHighlights(part)
              .slice(0, 4)
              .map((item) => item.value);

            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.16 }}
              >
                <motion.button
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${selected ? "Remove" : "Select"} ${part.name}`}
                  onClick={() => chooseProduct(part)}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.12 }}
                  className={`w-full border-l-2 px-4 py-4 text-left ${
                    selected
                      ? "accent-glow border-accent bg-surface"
                      : "border-transparent border-b border-b-border hover:bg-surface"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                        PART_{String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 text-base italic font-bold leading-5 uppercase font-display">
                        {part.name}
                      </p>
                      <p className="mt-2 font-mono text-[9px] uppercase leading-5 text-muted">
                        {specs.join(" / ")}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-mono text-sm font-bold">
                        ${part.price.toFixed(2)}
                      </span>

                      {part.componentType === "Storage" && (
                        <span className="font-mono text-[9px] uppercase text-accent-dark">
                          {
                            installedDrives.filter(
                              (drive) => drive.product.id === part.id,
                            ).length
                          }{" "}
                          installed · {selected ? "Remove one" : "Add drive"}
                        </span>
                      )}

                      <AnimatePresence>
                        {selected && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                            transition={{ duration: 0.15 }}
                            className="grid text-white size-6 place-items-center bg-accent"
                          >
                            <Check className="size-3.5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
                {part.componentType === "Storage" && selected && (
                  <button
                    type="button"
                    onClick={() => addStorage(part)}
                    aria-label={`Add another ${part.name}`}
                    className="w-full min-h-11 border-b border-border px-4 py-2 text-left font-mono text-[10px] uppercase text-accent-dark hover:bg-accent-soft"
                  >
                    + Add another
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredParts.length === 0 && (
          <div className="px-4 py-16 text-center">
            <p className="text-lg italic font-bold uppercase font-display">
              No parts found
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted">
              Adjust your search
            </p>
          </div>
        )}
      </div>
    </>
  );
}

type MobileBuildPanelProps = {
  build: BUILD;
  totalPrice: number;
  buildName: string;
  setBuildName: (value: string) => void;
  saveBuild: () => void;
  savedBuilds: SavedBuild[];
  loadBuild: (build: SavedBuild) => void;
  deleteSavedBuild: (id: string) => void;
  removePart: (category: Category) => void;
  removeDrive: (id: string) => void;
  resetBuild: () => void;
};

function MobileBuildPanel({
  build,
  totalPrice,
  buildName,
  setBuildName,
  resetBuild,
  saveBuild,
  savedBuilds,
  loadBuild,
  deleteSavedBuild,
  removePart,
  removeDrive,
}: MobileBuildPanelProps) {
  const rows: Array<{
    category: Category;
    label: string;
    part: CompatibleComponent | undefined;
  }> = [
    { category: "CPU", label: "Processor", part: build.CPU },
    { category: "GPU", label: "Graphics", part: build.GPU },
    { category: "MOTHERBOARD", label: "Motherboard", part: build.MOTHERBOARD },
    { category: "RAM", label: "Memory", part: build.RAM },
    { category: "PSU", label: "Power", part: build.PSU },
    { category: "CASE", label: "Case", part: build.CASE },
  ];

  return (
    <>
      <div className="p-4 border-b border-border">
        <div className="flex gap-2">
          <input
            value={buildName}
            onChange={(event) => setBuildName(event.target.value)}
            placeholder="BUILD NAME"
            className="h-10 min-w-0 flex-1 border border-border bg-surface px-3 font-mono text-[10px] uppercase outline-none focus:border-accent"
          />

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={saveBuild}
            className="px-5 text-xs italic font-bold text-white uppercase cut-corner bg-accent font-display"
          >
            Save
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={resetBuild}
            className="px-5 text-xs italic font-bold text-white uppercase cut-corner bg-accent font-display"
          >
            Reset
          </motion.button>
        </div>

        {savedBuilds.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {savedBuilds.map((save) => (
              <div
                key={save.id}
                className="flex items-center gap-2 px-3 py-2 border shrink-0 border-border bg-surface"
              >
                <span className="text-xs italic font-bold uppercase font-display">
                  {save.name}
                </span>
                <button
                  onClick={() => loadBuild(save)}
                  className="font-mono text-[9px] uppercase text-accent-dark"
                >
                  Load
                </button>
                <button
                  onClick={() => deleteSavedBuild(save.id)}
                  className="font-mono text-xs text-muted hover:text-danger"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {rows.map(({ category, label, part }) => (
          <div
            key={category}
            className="flex items-center justify-between gap-3 px-4 py-4 border-b border-border"
          >
            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted">
                {label}
              </p>
              <p className="mt-1 text-sm italic font-bold uppercase truncate font-display">
                {part?.name ?? "Not installed"}
              </p>
            </div>

            {part && (
              <button
                onClick={() => removePart(category)}
                className="font-mono text-[9px] uppercase text-danger"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {build.STORAGE.length === 0 && (
          <div className="px-4 py-4 border-b border-border">
            <p className="font-mono text-[8px] uppercase tracking-widest text-muted">
              Storage
            </p>
            <p className="mt-1 text-sm italic font-bold uppercase font-display text-muted">
              Not installed
            </p>
          </div>
        )}

        {build.STORAGE.map((drive) => (
          <div
            key={drive.instanceId}
            className="flex items-center justify-between gap-3 px-4 py-4 border-b border-border"
          >
            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted">
                Storage
              </p>
              <p className="mt-1 text-sm italic font-bold uppercase truncate font-display">
                {drive.product.name}
              </p>
            </div>

            <button
              onClick={() => removeDrive(drive.instanceId)}
              className="font-mono text-[9px] uppercase text-danger"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between px-4 py-4 border-t shrink-0 border-accent/30 bg-surface">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-accent-dark">
            Build value
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase text-muted">
            Current configuration
          </p>
        </div>

        <span className="text-2xl italic font-bold font-display">
          ${totalPrice.toFixed(2)}
        </span>
      </div>
    </>
  );
}

export function BuildPage() {
  const [searchParams] = useSearchParams();
  const panelDragControls = useDragControls();
  const buildNameInput = useRef<HTMLInputElement>(null);
  const savedBuildsBar = useRef<HTMLDivElement>(null);
  const [catalogCategory, setCatalogCategory] = useState("cpu");
  const [previewPart, setPreviewPart] = useState<CompatibleComponent | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [buildName, setBuildName] = useState("");
  const [mobilePanel, setMobilePanel] = useState<"parts" | "build" | null>(
    searchParams.get("panel") === "build" ? "build" : null,
  );

  const build = useBuildStore((state) => state.build);
  const setBuild = useBuildStore((state) => state.setBuild);

  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => {
    try {
      const stored = localStorage.getItem("retroforge.savedBuilds");
      if (!stored) return [];

      const result = savedBuildListSchema.safeParse(JSON.parse(stored));
      return result.success ? result.data : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("retroforge.savedBuilds", JSON.stringify(savedBuilds));
  }, [savedBuilds]);

  const activeGroup =
    componentGroups.find((group) => group.id === catalogCategory) ??
    componentGroups[0]!;

  const installedPart = {
    cpu: build.CPU,
    gpu: build.GPU,
    motherboard: build.MOTHERBOARD,
    ram: build.RAM,
    psu: build.PSU,
    case: build.CASE,
  }[catalogCategory];
  const selectedPartKey = installedPart
    ? `${installedPart.componentType}-${installedPart.id}`
    : undefined;

  const filteredParts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return activeGroup.items;

    return activeGroup.items.filter((part) => {
      const highlights = getPartHighlights(part);

      return [
        part.name,
        part.brand,
        ...highlights.flatMap((highlight) => [
          highlight.label,
          highlight.value,
        ]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [activeGroup, searchQuery]);

  const completedParts = [
    build.CPU,
    build.GPU,
    build.MOTHERBOARD,
    build.RAM,
    build.PSU,
    build.CASE,
    build.STORAGE.length > 0,
  ].filter(Boolean).length;

  const totalPrice =
    (build.CPU?.price ?? 0) +
    (build.GPU?.price ?? 0) +
    (build.MOTHERBOARD?.price ?? 0) +
    (build.RAM?.price ?? 0) +
    (build.PSU?.price ?? 0) +
    (build.CASE?.price ?? 0) +
    build.STORAGE.reduce((total, drive) => total + drive.product.price, 0);

  function openCategory(id: string) {
    setCatalogCategory(id);
    setPreviewPart(null);
    setSearchQuery("");
  }

  function installIfCompatible(proposedBuild: BUILD) {
    const selectedComponents = buildToComponents(proposedBuild);
    const results = validateBuild(selectedComponents);
    const detailedErrors = getDetailedErrors(selectedComponents);

    console.log("[compatibility] detailed build errors", detailedErrors);

    const conflict = results.find((result) => !result.isCompatible);

    if (conflict) {
      toast(
        `${conflict.selectedComponent} is incompatible with ${conflict.targetComponent},`
      );
      return false;
    }

    setBuild(proposedBuild);
    return true;
  }

  function installPart(part: CompatibleComponent) {
    switch (part.componentType) {
      case "CPU":
        installIfCompatible({ ...build, CPU: part });
        return;

      case "GPU":
        installIfCompatible({ ...build, GPU: part });
        return;

      case "RAM":
        installIfCompatible({ ...build, RAM: part });
        return;

      case "PSU":
        installIfCompatible({ ...build, PSU: part });
        return;

      case "Case":
        installIfCompatible({ ...build, CASE: part });
        return;

      case "Motherboard": {
        const usedM2 = build.STORAGE.filter(
          (drive) => drive.product.connector === "M.2",
        ).length;
        const usedSata = build.STORAGE.filter(
          (drive) => drive.product.connector === "SATA",
        ).length;

        if (usedM2 > part.m2Slots) {
          toast(`Remove ${usedM2 - part.m2Slots} M.2 drive(s) first.`);
          openCategory("storage");
          return;
        }

        if (usedSata > part.sataPorts) {
          toast(`Remove ${usedSata - part.sataPorts} SATA drive(s) first.`);
          openCategory("storage");
          return;
        }

        const unsupportedM2 = build.STORAGE.some(
          (drive) =>
            drive.product.connector === "M.2" &&
            !part.supportedM2Protocols.includes(drive.product.protocol),
        );

        if (unsupportedM2) {
          toast(
            "This motherboard does not support one or more installed M.2 drives.",
          );
          return;
        }

        installIfCompatible({ ...build, MOTHERBOARD: part });
        return;
      }

      case "Storage": {
        if (!build.MOTHERBOARD) {
          openCategory("motherboard");
          toast("Select a motherboard first.");
          return;
        }

        const usedM2 = build.STORAGE.filter(
          (drive) => drive.product.connector === "M.2",
        ).length;
        const usedSata = build.STORAGE.filter(
          (drive) => drive.product.connector === "SATA",
        ).length;

        if (part.connector === "M.2" && usedM2 >= build.MOTHERBOARD.m2Slots) {
          toast("No M.2 slots available.");
          return;
        }

        if (
          part.connector === "SATA" &&
          usedSata >= build.MOTHERBOARD.sataPorts
        ) {
          toast("No SATA ports available.");
          return;
        }

        if (
          part.connector === "M.2" &&
          !build.MOTHERBOARD.supportedM2Protocols.includes(part.protocol)
        ) {
          toast("This motherboard does not support that M.2 protocol.");
          return;
        }

        const installedDrive: InstalledDrive = {
          instanceId: crypto.randomUUID(),
          product: part,
        };

        installIfCompatible({
          ...build,
          STORAGE: [...build.STORAGE, installedDrive],
        });

        return;
      }
    }
  }

  function chooseProduct(part: CompatibleComponent) {
    if (part.componentType === "Storage") {
      const drive = build.STORAGE.find((drive) => drive.product.id === part.id);
      if (drive) {
        removeDrive(drive.instanceId);
        setPreviewPart(null);
        return;
      }
    } else {
      const category = part.componentType.toUpperCase() as Exclude<
        Category,
        "STORAGE"
      >;
      if (build[category]?.id === part.id) {
        if (removePart(category)) setPreviewPart(null);
        return;
      }
    }
    setPreviewPart(part);
    installPart(part);
  }

  function removePart(category: Category) {
    if (category === "MOTHERBOARD" && build.STORAGE.length > 0) {
      toast("Remove all drives before removing your motherboard.");
      return false;
    }

    setBuild((previous) => ({
      ...previous,
      [category]: undefined,
    }));
    return true;
  }

  function removeDrive(id: string) {
    setBuild((previous) => ({
      ...previous,
      STORAGE: previous.STORAGE.filter((drive) => drive.instanceId !== id),
    }));
  }

  function resetBuild() {
    setBuild(() => ({
      STORAGE: [],
    }));
  }

  function saveBuild() {
    const name = buildName.trim();

    if (!name) {
      toast("Build name cannot be empty.");
      return;
    }

    setSavedBuilds((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name,
        build,
      },
    ]);

    setBuildName("");
    toast(`Saved ${name}`);
  }

  function loadBuild(savedBuild: SavedBuild) {
    if (installIfCompatible(savedBuild.build)) {
      setPreviewPart(null);
      toast(`Loaded ${savedBuild.name}`);
    }
  }

  function deleteSavedBuild(id: string) {
    setSavedBuilds((previous) => previous.filter((save) => save.id !== id));
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-dvh flex-col overflow-hidden bg-background text-text">
        <NavBar
          variant="build"
          onOpenSaved={() => {
            if (window.matchMedia("(min-width: 1024px)").matches) {
              (
                savedBuildsBar.current?.querySelector("button") ??
                buildNameInput.current
              )?.focus();
            } else {
              setMobilePanel("build");
            }
          }}
        />

        {/* ========================= */}
        {/* MOBILE HEADER */}
        {/* ========================= */}

        <div className="shrink-0 border-b border-border px-4 py-3 lg:hidden">
          <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-accent-dark">
            Garage / Build_01
          </p>

          <div className="mt-1 flex items-end justify-between gap-3">
            <h1 className="text-xl italic font-bold uppercase font-display">
              Build your machine
            </h1>

            <span className="shrink-0 font-mono text-xs font-bold text-accent-dark">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* ========================= */}
        {/* DESKTOP HEADER */}
        {/* ========================= */}

        <header className="hidden shrink-0 items-center justify-between border-b border-border bg-surface px-8 py-4 lg:flex [@media(max-height:800px)]:py-2 [@media(max-height:700px)]:py-1.5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent-dark">
              Garage / Build_01
            </p>

            <h1 className="mt-1 font-display text-3xl font-bold uppercase italic tracking-[-0.04em] [@media(max-height:800px)]:text-2xl [@media(max-height:700px)]:text-xl">
              Build your machine
            </h1>
          </div>

          <div className="flex items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                Build name
              </span>

              <input
                ref={buildNameInput}
                value={buildName}
                onChange={(event) => setBuildName(event.target.value)}
                placeholder="UNTITLED BUILD"
                className="h-10 w-52 border border-border bg-background px-3 font-mono text-xs uppercase outline-none focus:border-accent [@media(max-height:800px)]:h-9"
              />
            </label>

            <motion.button
              type="button"
              onClick={saveBuild}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              className="cut-corner h-10 bg-accent px-6 text-sm italic font-bold uppercase text-white accent-glow font-display [@media(max-height:800px)]:h-9"
            >
              Save
            </motion.button>

            <motion.button
              type="button"
              onClick={resetBuild}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              className="cut-corner h-10 bg-accent px-6 text-sm italic font-bold uppercase text-white accent-glow font-display [@media(max-height:800px)]:h-9"
            >
              Reset
            </motion.button>
          </div>
        </header>

        {/* ========================= */}
        {/* MAIN LAYOUT */}
        {/* ========================= */}

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* ========================= */}
          {/* DESKTOP PARTS SIDEBAR */}
          {/* ========================= */}

          <aside className="hidden min-h-0 w-[350px] shrink-0 flex-col overflow-hidden border-r border-border bg-surface lg:flex">
            {/* DESKTOP CATEGORY GRID */}
            <div className="shrink-0 border-b border-border bg-border">
              <div className="grid grid-cols-2 gap-px">
                {componentGroups.map((component, index) => {
                  const Icon = component.icon;
                  const active = component.id === catalogCategory;

                  return (
                    <motion.button
                      key={component.id}
                      type="button"
                      onClick={() => openCategory(component.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`
            group relative flex min-h-[58px] items-center gap-3
            overflow-hidden px-4 py-3 text-left
            transition-colors

            ${
              active
                ? "text-white"
                : "bg-surface text-muted hover:bg-background hover:text-text"
            }
          `}
                    >
                      {/* ACTIVE BACKGROUND */}
                      {active && (
                        <motion.span
                          layoutId="active-category"
                          className="absolute inset-0 bg-accent"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}

                      {/* NUMBER */}
                      <span
                        className={`
              relative z-10 shrink-0 font-mono text-[8px]
              tracking-[0.18em]
              ${active ? "text-white/60" : "text-muted/60"}
            `}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* ICON */}
                      <Icon
                        className={`
              relative z-10 size-4 shrink-0
              ${active ? "text-white" : "text-muted group-hover:text-text"}
            `}
                      />

                      {/* LABEL */}
                      <span
                        className="
              relative z-10 min-w-0 truncate
              font-display text-sm font-bold
              italic uppercase tracking-wide
            "
                      >
                        {component.id === "motherboard" ? "MB" : component.name}
                      </span>

                      {/* ACTIVE INDICATOR */}
                      {active && (
                        <motion.span
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="
                absolute bottom-0 left-0 right-0 z-10
                h-[2px] origin-left bg-white/70
              "
                        />
                      )}
                    </motion.button>
                  );
                })}

                {/* Empty final cell so CASE keeps the 2-column structure */}
                {componentGroups.length % 2 !== 0 && (
                  <div aria-hidden="true" className="min-h-[58px] bg-surface" />
                )}
              </div>
            </div>

            {/* DESKTOP PART LIST */}
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
              <AnimatePresence mode="popLayout">
                {filteredParts.map((part, index) => {
                  const key = `${part.componentType}-${part.id}`;

                  const selected =
                    part.componentType === "Storage"
                      ? build.STORAGE.some(
                          (drive) => drive.product.id === part.id,
                        )
                      : selectedPartKey === key;

                  const specs = getPartHighlights(part)
                    .slice(0, 4)
                    .map((item) => item.value);

                  return (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: selected ? 5 : 0,
                      }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.16 }}
                    >
                      <motion.button
                        type="button"
                        aria-pressed={selected}
                        aria-label={`${selected ? "Remove" : "Select"} ${part.name}`}
                        onClick={() => chooseProduct(part)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ duration: 0.12 }}
                        className={`relative w-full border-l-2 px-4 py-4 text-left [@media(max-height:800px)]:py-3 [@media(max-height:700px)]:py-2 ${
                          selected
                            ? "accent-glow border-accent bg-background"
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

                            <p className="mt-1 text-xs text-muted">
                              {part.brand}
                            </p>
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
                          onClick={() => installPart(part)}
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

          {/* ========================= */}
          {/* VIEWPORT + RESPONSIVE UI */}
          {/* ========================= */}

          <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-background lg:overflow-hidden">
            {/* DESKTOP SAVED BUILDS */}
            {savedBuilds.length > 0 && (
              <div
                ref={savedBuildsBar}
                className="hidden shrink-0 items-center gap-2 overflow-x-auto border-b border-border bg-surface px-4 py-2 lg:flex [@media(max-height:700px)]:py-1"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                  Saved builds
                </span>

                {savedBuilds.map((save) => (
                  <div
                    key={save.id}
                    className="flex shrink-0 items-center gap-2 border-l border-border pl-3"
                  >
                    <span className="text-xs italic font-bold uppercase font-display">
                      {save.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => loadBuild(save)}
                      className="font-mono text-[9px] uppercase text-accent-dark hover:underline"
                    >
                      Load
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteSavedBuild(save.id)}
                      className="font-mono text-xs text-muted hover:text-danger"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ================================== */}
            {/* THE ONLY BUILD VIEWPORT / CANVAS */}
            {/* ================================== */}

            <div
              className="
              relative
              h-[46dvh]
              min-h-[330px]
              max-h-[500px]
              shrink-0
              overflow-hidden

              lg:h-auto
              lg:max-h-none
              lg:min-h-0
              lg:flex-1
            "
            >
              <BuildViewport
                selectedCategory={
                  categoryNames[catalogCategory] ?? catalogCategory
                }
                selectedPart={previewPart}
                build={build}
                onRemoveDrive={removeDrive}
                onRemovePart={(id) => removePart(id as Category)}
              />

              {/* MOBILE BUILD STATUS */}
              <div className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 lg:hidden">
                <div className="cut-corner border border-border bg-background/90 px-3 py-2 text-center backdrop-blur-md">
                  <p className="font-mono text-[7px] uppercase tracking-widest text-muted">
                    Build status
                  </p>

                  <p className="mt-0.5 text-sm italic font-bold font-display">
                    {completedParts} / 7 INSTALLED
                  </p>
                </div>
              </div>
            </div>

            {/* ========================= */}
            {/* MOBILE CATEGORY BAR */}
            {/* ========================= */}

            <div className="shrink-0 border-t border-border bg-surface lg:hidden">
              <div className="flex w-full">
                {componentGroups.map((component) => {
                  const Icon = component.icon;
                  const active = component.id === catalogCategory;

                  return (
                    <button
                      key={component.id}
                      onClick={() => openCategory(component.id)}
                      className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 ${
                        active ? "text-accent-dark" : "text-muted"
                      }`}
                    >
                      <Icon className="size-4" />

                      <span className="max-w-full truncate font-mono text-[8px] uppercase tracking-tight">
                        {component.name}
                      </span>

                      {active && (
                        <motion.span
                          layoutId="mobile-category"
                          className="absolute bottom-0 h-[2px] w-8 bg-accent"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================= */}
            {/* MOBILE CURRENT SELECTION */}
            {/* ========================= */}

            <div className="shrink-0 border-t border-border bg-background px-4 py-3 lg:hidden">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
                Current selection
              </p>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={
                    previewPart
                      ? `${previewPart.componentType}-${previewPart.id}`
                      : "none"
                  }
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="mt-1"
                >
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-base italic font-bold uppercase font-display">
                        {previewPart?.name ?? `Choose ${activeGroup.label}`}
                      </p>

                      {previewPart && (
                        <p className="mt-1 truncate font-mono text-[9px] uppercase text-muted">
                          {getPartHighlights(previewPart)
                            .slice(0, 3)
                            .map((item) => item.value)
                            .join(" / ")}
                        </p>
                      )}
                    </div>

                    {previewPart && (
                      <span className="shrink-0 font-mono text-sm font-bold text-accent-dark">
                        ${previewPart.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* MOBILE ACTIONS */}

            <div className="grid shrink-0 grid-cols-2 gap-px border-t border-border bg-border lg:hidden">
              <button
                onClick={() => setMobilePanel("parts")}
                className="bg-surface px-4 py-4 text-sm italic font-bold uppercase font-display active:bg-accent active:text-white"
              >
                Parts
              </button>

              <button
                onClick={() => setMobilePanel("build")}
                className="bg-accent px-4 py-4 text-sm italic font-bold uppercase text-white font-display"
              >
                Build · {completedParts}/7
              </button>
            </div>

            {/* ========================= */}
            {/* DESKTOP CURRENT SELECTION */}
            {/* ========================= */}

            <div className="hidden shrink-0 items-center justify-between border-t border-border bg-surface px-6 py-3 lg:flex [@media(max-height:800px)]:py-2 [@media(max-height:700px)]:py-1.5">
              <div className="min-w-0">
                <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted">
                  Current selection
                </p>

                <div className="mt-1 h-6 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={
                        previewPart
                          ? `${previewPart.componentType}-${previewPart.id}`
                          : "empty"
                      }
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.16 }}
                      className="truncate text-lg italic font-bold uppercase font-display"
                    >
                      {previewPart?.name ?? "Select a component"}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {previewPart && (
                <div className="text-right">
                  <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted">
                    Price
                  </p>

                  <p className="mt-1 font-mono text-xl font-bold text-accent-dark">
                    ${previewPart.price.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* ========================= */}
        {/* MOBILE DRAWER */}
        {/* ========================= */}

        <AnimatePresence>
          {mobilePanel && (
            <>
              <motion.button
                aria-label="Close panel"
                onClick={() => setMobilePanel(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.22, ease: "easeOut" },
                }}
                className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] lg:hidden"
              />

              <motion.div
                drag="y"
                dragControls={panelDragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.5 }}
                onDragEnd={(_, info) => {
                  if (
                    info.offset.y > 80 ||
                    (info.offset.y > 20 && info.velocity.y > 500)
                  ) {
                    setMobilePanel(null);
                  }
                }}
                initial={{ y: "100%" }}
                animate={{
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 320,
                    damping: 30,
                    mass: 0.8,
                  },
                }}
                exit={{
                  y: "100%",
                  transition: {
                    duration: 0.28,
                    ease: [0.4, 0, 1, 1],
                  },
                }}
                className="fixed inset-x-0 bottom-0 z-50 flex h-[78dvh] flex-col border-t border-border bg-background backdrop-blur-[2px] lg:hidden"
              >
                <div
                  onPointerDown={(event) => {
                    if (!(event.target as HTMLElement).closest("button")) {
                      panelDragControls.start(event);
                    }
                  }}
                  className="relative flex shrink-0 touch-none cursor-grab items-center justify-between border-b border-border px-4 pb-3 pt-6 active:cursor-grabbing"
                >
                  <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-muted/40" />

                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-accent-dark">
                      {mobilePanel === "parts" ? "Parts index" : "Build status"}
                    </p>

                    <h2 className="mt-1 text-xl italic font-bold uppercase font-display">
                      {mobilePanel === "parts"
                        ? activeGroup.label
                        : "Your machine"}
                    </h2>
                  </div>

                  <button
                    onClick={() => setMobilePanel(null)}
                    className="grid size-9 place-items-center border border-border text-muted hover:border-accent hover:text-text"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {mobilePanel === "parts" ? (
                  <PullDownToClose onClose={() => setMobilePanel(null)}>
                    <MobilePartsPanel
                      activeGroup={activeGroup}
                      filteredParts={filteredParts}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      selectedPartKey={selectedPartKey}
                      installedDrives={build.STORAGE}
                      addStorage={installPart}
                      chooseProduct={chooseProduct}
                    />
                  </PullDownToClose>
                ) : (
                  <PullDownToClose onClose={() => setMobilePanel(null)}>
                    <MobileBuildPanel
                      build={build}
                      totalPrice={totalPrice}
                      resetBuild={resetBuild}
                      buildName={buildName}
                      setBuildName={setBuildName}
                      saveBuild={saveBuild}
                      savedBuilds={savedBuilds}
                      loadBuild={loadBuild}
                      deleteSavedBuild={deleteSavedBuild}
                      removePart={removePart}
                      removeDrive={removeDrive}
                    />
                  </PullDownToClose>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
