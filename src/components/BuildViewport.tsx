import {
  Center,
  Grid,
  Html,
  OrbitControls,
  useProgress,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import type { BUILD, CompatibleComponent } from "@/data/type";
import { Suspense, useEffect } from "react";
import { PcAssembly } from "./PcAssembly";
import { getPartHighlights } from "@/lib/getPartHighlights";
import { specDescriptions } from "@/data/specDescriptions";

type BuildViewportProps = {
  selectedCategory: string;
  selectedPart: CompatibleComponent | null;
  build: BUILD;
  onRemoveDrive: (targetid: string) => void;
  onRemovePart: (targetid: string) => void;
};

function RendererSettings() {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    gl.toneMappingExposure = 1.4;
  }, [gl]);

  return null;
}

function ModelLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="font-mono text-xs tracking-widest uppercase text-muted">
        Loading assmebly {Math.round(progress)}%
      </div>
    </Html>
  );
}

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

  const selectedPartHighlights = selectedPart
    ? getPartHighlights(selectedPart)
    : [];

  return (
    <section className="relative flex-1 min-h-0 overflow-hidden border build-scene border-border bg-surface">
      <Canvas
        shadows
        camera={{
          position: [6.5, 3.5, 7.5],
          fov: 38,
        }}
        dpr={[1, 1.5]}
      >
        <RendererSettings />
        <ambientLight intensity={0.45} />

        <hemisphereLight intensity={1} color="#ffffff" groundColor="#292d35" />

        <directionalLight
          castShadow
          position={[5, 8, 6]}
          intensity={2.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-bias={-0.0005}
        />

        <directionalLight position={[-4, 4, 4]} intensity={1.2} />

        <directionalLight position={[-1, 5, -6]} intensity={1.2} />

        <pointLight
          position={[2, 2, 4]}
          intensity={15}
          distance={12}
          decay={2}
        />
        <Suspense fallback={<ModelLoader />}>
          <Center>
            <PcAssembly />
          </Center>
        </Suspense>

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2.29, 0]}
          receiveShadow
        >
          <planeGeometry args={[30, 30]} />
          <shadowMaterial transparent opacity={0.2} />
        </mesh>

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

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={5}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0.2, 0]}
        />
      </Canvas>

      {/* The overlay ignores pointer input so every drag reaches OrbitControls. */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets distinguish the viewport from ordinary page content. */}
        <span className="absolute border-t border-l left-3 top-3 size-5 border-accent sm:left-5 sm:top-5" />
        <span className="absolute border-t border-r right-3 top-3 size-5 border-accent sm:right-5 sm:top-5" />
        <span className="absolute border-b border-l bottom-3 left-3 size-5 border-accent sm:bottom-5 sm:left-5" />
        <span className="absolute border-b border-r bottom-3 right-3 size-5 border-accent sm:bottom-5 sm:right-5" />

        <div className="absolute hidden px-4 py-3 border-l-2 left-5 top-5 border-accent bg-surface/80 backdrop-blur-sm sm:block">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            Assembly viewport / 01
          </p>
          <p className="mt-1 text-lg font-medium font-display text-text">
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
            className="absolute pointer-events-auto cursor-pointer  bottom-5 left-1/2 w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 border border-border bg-surface/85 px-4 py-3 backdrop-blur-md"
          >
            {selectedPart ? (
              // Product details intentionally stay compact so the canvas remains
              // the dominant element rather than becoming another product card.
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-accent-dark">
                      Inspecting / {selectedPart.componentType}
                    </p>
                    <p className="mt-1 text-sm font-medium truncate font-text text-text">
                      {selectedPart.name}
                    </p>
                  </div>
                  <span className="font-mono text-xs shrink-0 text-muted">
                    ${selectedPart.price.toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedPartHighlights.map((spec) => (
                    <span
                      key={spec.label}
                      title={
                        specDescriptions[spec.label] ??
                        spec.label
                      }
                      className="
          border border-border
          bg-background/60
          px-2 py-1
          font-mono text-[8px]
          uppercase tracking-widest
          text-muted
        "
                    >
                      {spec.value}
                    </span>
                  ))}
                </div>
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
          <div className="pt-3 mt-4 border-t border-border">
            <p className="text-xs text-muted">CPU</p>
            <p className="mt-1 text-sm wrap-break-word">
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
          <div className="pt-3 mt-4 border-t border-border">
            <p className="text-xs text-muted">GPU</p>
            <p className="mt-1 text-sm wrap-break-word">
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
          <div className="pt-3 mt-4 border-t border-border">
            <p className="text-xs text-muted">MOTHERBOARD</p>
            <p className="mt-1 text-sm wrap-break-word">
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
          <div className="pt-3 mt-4 border-t border-border">
            <p className="text-xs text-muted">RAM</p>
            <p className="mt-1 text-sm wrap-break-word">
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
          <div className="pt-3 mt-4 border-t border-border">
            <p className="text-xs text-muted">PSU</p>
            <p className="mt-1 text-sm wrap-break-word">
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
          <div className="pt-3 mt-4 border-t border-border">
            <p className="text-xs text-muted">CASE</p>
            <p className="mt-1 text-sm wrap-break-word">
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
          <div className="pt-3 mt-4 border-t border-border">
            <p className="text-xs text-muted">STORAGE</p>
            <div className="mt-1 text-sm wrap-break-word">
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
