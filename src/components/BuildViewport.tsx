import {
  Center,
  Grid,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import type { BUILD, CompatibleComponent } from "@/data/type";
import { Suspense } from "react";
import { PcAssembly } from "./PcAssembly";



type BuildViewportProps = {
  selectedCategory: string;
  selectedPart: CompatibleComponent | null;
  build: BUILD;
  onRemoveDrive: (targetid: string) => void;
  onRemovePart: (targetid: string) => void;
};

export function BuildViewport({
  selectedCategory,
  selectedPart,
  build,
  onRemoveDrive,
  onRemovePart,
}: BuildViewportProps) {
  const partsSubtotal =
    (build.CPU?.price ?? 0) +
    (build.GPU?.price ?? 0) +
    (build.RAM?.price ?? 0) +
    (build.MOTHERBOARD?.price ?? 0) +
    (build.PSU?.price ?? 0) +
    (build.CASE?.price ?? 0);
  const storageSubtotal = build.STORAGE.reduce(
    (total, drive) => total + drive.product.price,
    0,
  );
  const totalPrice = partsSubtotal + storageSubtotal;


  return (
    <section className="build-scene relative min-h-0 flex-1 overflow-hidden border border-border bg-surface">
      <Canvas
        camera={{ position: [7.2, 4.8, 8.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        className="bg-[radial-gradient(circle_at_50%_42%,var(--color-accent-soft),transparent_62%)]"
      >
        <hemisphereLight intensity={1.5} />
        <directionalLight position={[6, 7, 6]} intensity={3} />
        <directionalLight position={[-4, 3, -5]} intensity={2} />
        {/* Keep GLB loading inside the scene so it cannot suspend the page's
            entrance animation and leave the workspace at opacity zero. */}
        <Grid
          position={[0, -2.3, 0]}
          args={[32, 32]}
          cellSize={0.5}
          cellThickness={0.45}
          cellColor="#77736b"
          sectionSize={2.5}
          sectionThickness={1.05}
          sectionColor="#5d6b82"
          fadeDistance={22}
          fadeStrength={1.3}
          infiniteGrid
        />
        <Suspense
          fallback={
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="yellow" />
            </mesh>
          }
        >
          <Center>


           <PcAssembly />


          </Center>
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={1}
          maxDistance={12}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* The overlay ignores pointer input so every drag reaches OrbitControls. */}
      <div className="pointer-events-none absolute inset-0">
        {/* Corner brackets distinguish the viewport from ordinary page content. */}
        <span className="absolute left-3 top-3 size-5 border-l border-t border-accent sm:left-5 sm:top-5" />
        <span className="absolute right-3 top-3 size-5 border-r border-t border-accent sm:right-5 sm:top-5" />
        <span className="absolute bottom-3 left-3 size-5 border-b border-l border-accent sm:bottom-5 sm:left-5" />
        <span className="absolute bottom-3 right-3 size-5 border-b border-r border-accent sm:bottom-5 sm:right-5" />

        <div className="absolute left-5 top-5 hidden border-l-2 border-accent bg-surface/80 px-4 py-3 backdrop-blur-sm sm:block">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            Assembly viewport / 01
          </p>
          <p className="mt-1 font-display text-lg font-medium text-text">
            {selectedCategory}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {/* A stable identity makes Motion replace the previous readout cleanly
              when the inspected product changes. */}
          <motion.div
            key={
              selectedPart
                ? `${selectedPart.componentType}-${selectedPart.id}`
                : "empty"
            }
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-5 left-1/2 w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 border border-border bg-surface/85 px-4 py-3 backdrop-blur-md"
          >
            {selectedPart ? (
              // Product details intentionally stay compact so the canvas remains
              // the dominant element rather than becoming another product card.
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-accent-dark">
                    Inspecting / {selectedPart.componentType}
                  </p>
                  <p className="mt-1 truncate font-text text-sm font-medium text-text">
                    {selectedPart.name}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted">
                  ${selectedPart.price.toFixed(2)}
                </span>
              </div>
            ) : (
              // The empty state teaches the two available interactions without
              // blocking the canvas or implying that a part was auto-selected.
              <div className="flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                <span>Select a part from the index</span>
                <span className="hidden sm:block">
                  Drag / Orbit · Scroll / Zoom
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <aside className="build-summary">
        <h2 className="build-summary-heading">Your build</h2>
        <div className="build-summary-items">
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs text-muted">CPU</p>
            <p className="mt-1 wrap-break-word text-sm">
              {build.CPU?.name ?? "No CPU selected"}
              {build.CPU && (
                <button
                  className="build-remove-button"
                  onClick={() => onRemovePart("CPU")}
                >
                  Remove
                </button>
              )}
            </p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs text-muted">GPU</p>
            <p className="mt-1 wrap-break-word text-sm">
              {build.GPU?.name ?? "No GPU selected"}
              {build.GPU && (
                <button
                  className="build-remove-button"
                  onClick={() => onRemovePart("GPU")}
                >
                  Remove
                </button>
              )}
            </p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs text-muted">MOTHERBOARD</p>
            <p className="mt-1 wrap-break-word text-sm">
              {build.MOTHERBOARD?.name ?? "No MOTHERBOARD selected"}
              {build.MOTHERBOARD && (
                <button
                  className="build-remove-button"
                  onClick={() => onRemovePart("MOTHERBOARD")}
                >
                  Remove
                </button>
              )}
            </p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs text-muted">RAM</p>
            <p className="mt-1 wrap-break-word text-sm">
              {build.RAM?.name ?? "No RAM selected"}
              {build.RAM && (
                <button
                  className="build-remove-button"
                  onClick={() => onRemovePart("RAM")}
                >
                  Remove
                </button>
              )}
            </p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs text-muted">PSU</p>
            <p className="mt-1 wrap-break-word text-sm">
              {build.PSU?.name ?? "No PSU selected"}
              {build.PSU && (
                <button
                  className="build-remove-button"
                  onClick={() => onRemovePart("PSU")}
                >
                  Remove
                </button>
              )}
            </p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs text-muted">CASE</p>
            <p className="mt-1 wrap-break-word text-sm">
              {build.CASE?.name ?? "No CASE selected"}
              {build.CASE && (
                <button
                  className="build-remove-button"
                  onClick={() => onRemovePart("CASE")}
                >
                  Remove
                </button>
              )}
            </p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs text-muted">STORAGE</p>
            <div className="mt-1 wrap-break-word text-sm">
              {build.STORAGE.length === 0 ? (
                <p>No Storage Selected</p>
              ) : (
                build.STORAGE.map((drive) => (
                  <div key={drive.instanceId}>
                    <p>{drive.product.name}</p>
                    <button
                      className="build-remove-button"
                      onClick={() => onRemoveDrive(drive.instanceId)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="build-summary-total">
          <span className="text-sm text-muted">Total</span>
          <span className="font-mono text-lg font-semibold text-text">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </aside>
    </section>
  );
}
