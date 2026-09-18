import {
  Center,
  Grid,
  Html,
  OrbitControls,
  useProgress,
} from "@react-three/drei";
import {
  Box,
  Check,
  CircuitBoard,
  Cpu,
  Gpu,
  HardDrive,
  MemoryStick,
  PlugZap,
  Trash2,
  type LucideIcon,
} from "lucide-react";
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

type BuildPartRowProps = {
  label: string;
  name?: string;
  price?: number;
  icon: LucideIcon;
  emptyText: string;
  onRemove?: () => void;
};

function BuildPartRow({
  label,
  name,
  price,
  icon: Icon,
  emptyText,
  onRemove,
}: BuildPartRowProps) {
  const selected = Boolean(name);

  return (
    <div
      className={`
        group flex gap-3 border-b border-border px-4 py-4
        transition-colors
        ${selected ? "hover:bg-accent-soft/30" : ""}
      `}
    >
      {/* ICON */}

      <div
        className={`
          grid size-9 shrink-0 place-items-center border
          ${
            selected
              ? "border-accent/30 bg-accent-soft text-accent-dark"
              : "border-border bg-background/50 text-muted"
          }
        `}
      >
        {selected ? (
          <Icon className="size-4" />
        ) : (
          <Icon className="size-4 opacity-40" />
        )}
      </div>

      {/* CONTENT */}

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium font-text text-muted">{label}</p>

        {selected ? (
          <>
            <p className="mt-1 text-sm font-medium leading-5 font-text text-text">
              {name}
            </p>

            {price !== undefined && (
              <p className="mt-1 font-mono text-xs text-muted">
                ${price.toFixed(2)}
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 text-sm font-text text-muted">{emptyText}</p>
        )}
      </div>

      {/* REMOVE */}

      {selected && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          title={`Remove ${label}`}
          aria-label={`Remove ${label}`}
          className="grid transition-all border border-transparent size-8 shrink-0 place-items-center text-muted opacity-60 hover:border-border hover:bg-background hover:text-text group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  );
}

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
  const completedParts = [
    build.CPU,
    build.GPU,
    build.MOTHERBOARD,
    build.RAM,
    build.PSU,
    build.CASE,
    build.STORAGE.length > 0,
  ].filter(Boolean).length;

  const totalPartCategories = 7;

  const buildProgress = (completedParts / totalPartCategories) * 100;
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
            className="absolute pointer-events-auto cursor-pointer  border  bottom-5 left-1/2 w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2  border-accent bg-surface/85 px-4 py-3 backdrop-blur-md"
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
                      title={specDescriptions[spec.label] ?? spec.label}
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
      <aside
        className="
    absolute right-4 top-4
    flex max-h-[calc(100%-2rem)] w-[320px]
    flex-col
    border border-border
    bg-surface/95
    backdrop-blur-md
  "
      >
        {/* HEADER */}

        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold font-text text-text">
                Your build
              </h2>

              <p className="mt-1 text-xs font-text text-muted">
                {completedParts} of {totalPartCategories} categories selected
              </p>
            </div>

            <div
              className="
          flex items-center gap-1.5
          border border-accent/20
          bg-accent-soft
          px-2 py-1
          font-text text-xs
          font-medium text-accent-dark
        "
            >
              <Check className="size-3" />
              {completedParts}/{totalPartCategories}
            </div>
          </div>

          {/* PROGRESS BAR */}

          <div className="mt-4 h-1.5 overflow-hidden bg-background">
            <div
              className="h-full transition-all duration-300 bg-accent"
              style={{
                width: `${buildProgress}%`,
              }}
            />
          </div>
        </div>

        {/* PART LIST */}

        <div className="flex-1 min-h-0 overflow-y-auto">
          <BuildPartRow
            label="Processor"
            name={build.CPU?.name}
            price={build.CPU?.price}
            icon={Cpu}
            emptyText="Choose a processor"
            onRemove={build.CPU ? () => onRemovePart("CPU") : undefined}
          />

          <BuildPartRow
            label="Graphics"
            name={build.GPU?.name}
            price={build.GPU?.price}
            icon={Gpu}
            emptyText="Choose a graphics card"
            onRemove={build.GPU ? () => onRemovePart("GPU") : undefined}
          />

          <BuildPartRow
            label="Motherboard"
            name={build.MOTHERBOARD?.name}
            price={build.MOTHERBOARD?.price}
            icon={CircuitBoard}
            emptyText="Choose a motherboard"
            onRemove={
              build.MOTHERBOARD ? () => onRemovePart("MOTHERBOARD") : undefined
            }
          />

          <BuildPartRow
            label="Memory"
            name={build.RAM?.name}
            price={build.RAM?.price}
            icon={MemoryStick}
            emptyText="Choose memory"
            onRemove={build.RAM ? () => onRemovePart("RAM") : undefined}
          />

          <BuildPartRow
            label="Power supply"
            name={build.PSU?.name}
            price={build.PSU?.price}
            icon={PlugZap}
            emptyText="Choose a power supply"
            onRemove={build.PSU ? () => onRemovePart("PSU") : undefined}
          />

          <BuildPartRow
            label="Case"
            name={build.CASE?.name}
            price={build.CASE?.price}
            icon={Box}
            emptyText="Choose a case"
            onRemove={build.CASE ? () => onRemovePart("CASE") : undefined}
          />

          {/* STORAGE */}

          <div className="px-4 py-4 border-b border-border">
            <div className="flex gap-3">
              <div
                className={`
            grid size-9 shrink-0 place-items-center border
            ${
              build.STORAGE.length > 0
                ? "border-accent/30 bg-accent-soft text-accent-dark"
                : "border-border bg-background/50 text-muted"
            }
          `}
              >
                <HardDrive
                  className={`size-4 ${
                    build.STORAGE.length === 0 ? "opacity-40" : ""
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium font-text text-muted">
                  Storage
                </p>

                {build.STORAGE.length === 0 ? (
                  <p className="mt-1 text-sm font-text text-muted">
                    Choose storage
                  </p>
                ) : (
                  <div className="mt-2 space-y-3">
                    {build.STORAGE.map((drive) => (
                      <div
                        key={drive.instanceId}
                        className="flex items-start justify-between gap-3 "
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-5 font-text text-text">
                            {drive.product.name}
                          </p>

                          <p className="mt-1 font-mono text-xs text-muted">
                            ${drive.product.price.toFixed(2)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveDrive(drive.instanceId)}
                          title="Remove storage"
                          aria-label={`Remove ${drive.product.name}`}
                          className="grid transition-colors size-8 shrink-0 place-items-center text-muted hover:bg-background hover:text-text"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL */}

        <div
          className="px-4 py-4 border-t shrink-0 border-border bg-surface"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-text text-muted">Estimated total</p>

              <p className="mt-1 font-text text-[11px] text-muted">
                Current configuration
              </p>
            </div>

            <span className="font-mono text-xl font-semibold text-text">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </aside>
    </section>
  );
}
