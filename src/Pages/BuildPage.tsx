import { useEffect, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { toast } from "sonner";
import { BuildViewport } from "@/components/BuildViewport";
import { NavBar } from "@/components/NavBar";
import { ComponentSidebar } from "@/components/ui/Nav/ComponentSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type {
  BUILD,
  Category,
  CompatibleComponent,
  InstalledDrive,
  SavedBuild,
} from "@/data/type";
import { useSidebarStore } from "@/stores/expandedCategory";
import { gpuSchema, savedBuildListSchema } from "@/zod/buildSchema";
import { gpus } from "@/data/gpu";
import {
  buildToComponents,
  validateBuild,
} from "@/Logic/Compatibility/Compatibility";

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

// Testing ZOD.
const result = gpus.every((gpu) => gpuSchema.safeParse(gpu).success);
console.log(result);

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
  const [catalogCategory, setCatalogCategory] = useState("cpu");
  const [previewPart, setPreviewPart] = useState<CompatibleComponent | null>(
    null,
  );
  // whole Build state
  const [build, setBuild] = useState<BUILD>({ STORAGE: [] });
  // Zustand
  const expandCategory = useSidebarStore((state) => state.openCategory);

  // Saved Build State
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => {
    try {
      const storedSaved = localStorage.getItem("retroforge.savedBuilds");

      if (storedSaved == null) {
        return [];
      }
      const parsed = JSON.parse(storedSaved);
      const result = savedBuildListSchema.safeParse(parsed);
      return result.success ? result.data : [];
    } catch {
      return [];
    }
  });
  const [buildName, setBuildName] = useState("");

  // Local-Storage

  useEffect(() => {
    localStorage.setItem("retroforge.savedBuilds", JSON.stringify(savedBuilds));
  }, [savedBuilds]);

  // IDs restart inside different data files, so componentType is included to
  // create a collision-free UI key such as "CPU-1" versus "GPU-1".
  const selectedPartKey = previewPart
    ? `${previewPart.componentType}-${previewPart.id}`
    : undefined;

  /**
   * Switches catalog context and clears an inspection that no longer belongs
   * to the visible category.
   *
   * @param {string} componentId - Stable sidebar ID such as `cpu` or `storage`.
   * @returns {void}
   * @remarks This state-only handler does not intentionally throw.
   */

  function openCategory(componentId: string) {
    setCatalogCategory(componentId);
    // Clearing prevents a GPU name, for example, from remaining visible after
    // the user changes the viewport context to a motherboard bay.
    setPreviewPart(null);
  }

  // helper function

  function installIfCompatible(proposedBuild: BUILD) {
    const components = buildToComponents(proposedBuild);
    const results = validateBuild(components);
    const conflict = results.find((result) => result.isCompatible === false);

    if (conflict) {
      toast(
        `${conflict.selectedComponent} is incompatible with ${conflict.targetComponent}.`,
      );
      return false;
    }

    setBuild(proposedBuild);
    return true;
  }

  function installPart(part: CompatibleComponent) {
    // Sinlge-part caterogies replace their slot while preserving the rest of the build
    if (part.componentType === "CPU") {
      const proposedBuild: BUILD = {
        ...build,
        CPU: part,
      };
      installIfCompatible(proposedBuild);
    }
    if (part.componentType === "GPU") {
      const proposedBuild: BUILD = {
        ...build,
        GPU: part,
      };
      installIfCompatible(proposedBuild);
    }
    if (part.componentType === "Case") {
      const proposedBuild: BUILD = {
        ...build,
        CASE: part,
      };
      installIfCompatible(proposedBuild);
    }
    // TODO: checking installed Drives against the enw motherboard before replacing it
    if (part.componentType === "Motherboard") {
      // M.2
      const usedM2Slots = build.STORAGE.filter(
        (drive) => drive.product.connector === "M.2",
      ).length;
      if (usedM2Slots > part.m2Slots) {
        toast(
          `Warning: The Motherboard you're choosing does not have enough M.2 slots pls remove ${usedM2Slots - part.m2Slots} M.2 Storage Devices`,
        );
        expandCategory("storage");
        return;
      }
      // SATA
      const usedSataPorts = build.STORAGE.filter(
        (drive) => drive.product.connector === "SATA",
      ).length;
      if (usedSataPorts > part.sataPorts) {
        toast(
          `Warning: The Motherboard you're choosing does not have enough SATA ports pls remove ${usedSataPorts - part.sataPorts} SATA Storage Devices`,
        );
        expandCategory("storage");
        return;
      }
      const hasUnsupportedM2Drive = build.STORAGE.some(
        (drive) =>
          drive.product.connector === "M.2" &&
          !part.supportedM2Protocols.includes(drive.product.protocol),
      );

      if (hasUnsupportedM2Drive) {
        toast(
          `This motherboard doesn’t support the protocol of one or more installed M.2 drives.`,
        );
        return;
      }

      const proposedBuild: BUILD = {
        ...build,
        MOTHERBOARD: part,
      };
      installIfCompatible(proposedBuild);
    }
    if (part.componentType === "RAM") {
      const proposedBuild: BUILD = {
        ...build,
        RAM: part,
      };
      installIfCompatible(proposedBuild);
    }
    if (part.componentType === "PSU") {
      const proposedBuild: BUILD = {
        ...build,
        PSU: part,
      };
      installIfCompatible(proposedBuild);
    }
    // Storage supports multiple installed drives, so valid additions append to a array.
    if (part.componentType === "Storage") {
      // Require a motherboard first, guides the user to its catalog and stop this addition
      if (!build.MOTHERBOARD) {
        openCategory("motherboard");
        expandCategory("motherboard");
        toast("Select a Motherboard first");
        return;
      }
      // Count occupied M.2 slots and block another M.2 drive when capacity is reaching
      const usedM2Slots = build.STORAGE.filter(
        (drive) => drive.product.connector === "M.2",
      ).length;
      const isM2Full =
        part.connector === "M.2" && build.MOTHERBOARD.m2Slots <= usedM2Slots;
      if (isM2Full) {
        toast("No M.2 slots available");
        return;
      }

      // Sata ports have a seperate capacity from M.2.
      const usedSataPorts = build.STORAGE.filter(
        (drive) => drive.product.connector === "SATA",
      ).length;
      const isSataFull =
        part.connector === "SATA" &&
        build.MOTHERBOARD.sataPorts <= usedSataPorts;
      if (isSataFull) {
        toast("No Sata ports available");
        return;
      }
      // An available M.2 slot must also support the selected drive's protocol.
      if (
        !build.MOTHERBOARD.supportedM2Protocols.includes(part.protocol) &&
        part.connector === "M.2"
      ) {
        toast("Unsupported Protocol Choose a Different Storage Device");
        return;
      }
      // Give each installed copy its own ID, even when adding the same product twice.
      const newId = crypto.randomUUID();
      const installedDrive: InstalledDrive = {
        instanceId: newId,
        product: part,
      };
      // Preserve existing parts and append the new installed-drive entry.
      const proposedBuild: BUILD = {
        ...build,
        STORAGE: [...build.STORAGE, installedDrive],
      };

      installIfCompatible(proposedBuild);
    }
  }

  function removePart(category: Category) {
    if (build.STORAGE.length > 0 && category === "MOTHERBOARD") {
      toast("remove all drives before removing your motherboard");
      return;
    }

    setBuild((prevBuild) => ({
      ...prevBuild,
      [category]: undefined,
    }));
  }

  function saveBuild() {
    const cleanName = buildName.trim();
    if (cleanName === "") {
      toast("Build name cannot be empty.");
      return;
    }
    const newId = crypto.randomUUID();
    const newSave: SavedBuild = {
      id: newId,
      name: cleanName,
      build: build,
    };
    setSavedBuilds((prevSaves) => [...prevSaves, newSave]);
    setBuildName("");
    toast(`Saved ${cleanName}`);
  }

  function loadBuild(savedBuild: SavedBuild) {
    const loaded = installIfCompatible(savedBuild.build);

    if (loaded) {
      setPreviewPart(null);
      toast(`Loaded ${savedBuild.name}`);
    }
  }

  function deleteSavedBuild(targetId: string) {
    setSavedBuilds((previousSaves) =>
      previousSaves.filter((save) => save.id !== targetId),
    );
  }

  function removeDrive(targetId: string) {
    setBuild((prevBuild) => ({
      ...prevBuild,
      STORAGE: prevBuild.STORAGE.filter(
        (drive) => drive.instanceId !== targetId,
      ),
    }));
  }

  function chooseProduct(part: CompatibleComponent) {
    setPreviewPart(part);
    installPart(part);
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
          selectedComponent={catalogCategory}
          onSelectComponent={openCategory}
          showCatalog
          selectedPartKey={selectedPartKey}
          onSelectPart={chooseProduct}
        />

        <SidebarInset className="min-h-0 overflow-hidden bg-background">
          <NavBar variant="build" />

          <motion.div
            initial={{ opacity: 0, scale: 0.992 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-5"
          >
            <div className="build-workspace-toolbar flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent-dark">
                  Build workspace
                </p>
                <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-text sm:text-3xl">
                  Assemble your system.
                </h1>
              </div>
              <div className="build-save-controls">
                <label className="build-name-field">
                  <span>Build name</span>
                  <input
                    placeholder="Name your build"
                    value={buildName}
                    onChange={(event) => setBuildName(event.target.value)}
                  />
                </label>
                <button className="build-save-button" onClick={saveBuild}>
                  Save build
                </button>
              </div>

              <div className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted sm:flex">
                <span className="size-1.5 rounded-full bg-accent" />
                Viewport ready
              </div>
            </div>

            {savedBuilds.length > 0 && (
              <div className="saved-build-list">
                <span className="saved-build-label">Saved builds</span>
                {savedBuilds.map((save) => (
                  <div className="saved-build-name" key={save.id}>
                    <span>{save.name}</span>
                    <button type="button" onClick={() => loadBuild(save)}>
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSavedBuild(save.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            <BuildViewport
              selectedCategory={
                // The fallback keeps the UI resilient if a new catalog group is
                // added before its friendlier viewport name is written.
                categoryNames[catalogCategory] ?? catalogCategory
              }
              selectedPart={previewPart}
              build={build}
              onRemoveDrive={removeDrive}
              onRemovePart={(targetId) => removePart(targetId as Category)}
            />
          </motion.div>
        </SidebarInset>
      </SidebarProvider>
    </MotionConfig>
  );
}
