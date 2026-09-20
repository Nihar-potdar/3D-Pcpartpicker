import {
  Center,
  Environment,
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
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import type { BUILD, CompatibleComponent } from "@/data/type";
import { Suspense } from "react";
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
      className={`group relative flex gap-3 border-b border-border px-4 py-3.5 transition ${
        selected ? "hover:bg-background/70" : ""
      }`}
    >
      {selected && (
        <span className="absolute inset-y-0 left-0 w-[2px] bg-accent" />
      )}

      <div
        className={`grid size-9 shrink-0 place-items-center border ${
          selected
            ? "border-accent/40 bg-accent-soft text-accent-dark"
            : "border-border bg-background/40 text-muted"
        }`}
      >
        <Icon className={`size-4 ${selected ? "" : "opacity-40"}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
          {label}
        </p>

        {selected ? (
          <>
            <p className="mt-1 text-sm italic font-bold leading-5 uppercase font-display text-text">
              {name}
            </p>
            {price !== undefined && (
              <p className="mt-1 font-mono text-[10px] text-accent-dark">
                ${price.toFixed(2)}
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 text-xs font-text text-muted">{emptyText}</p>
        )}
      </div>

      {selected && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          title={`Remove ${label}`}
          aria-label={`Remove ${label}`}
          className="grid transition border border-transparent opacity-50 size-8 shrink-0 place-items-center text-muted hover:border-danger/40 hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  );
}

function ModelLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="px-5 py-3 border cut-corner border-accent/40 bg-background/90 backdrop-blur-md">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent-dark">
          Initializing assembly
        </p>
        <p className="mt-1 text-xl italic font-bold font-display text-text">
          {Math.round(progress)}%
        </p>
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
    <section className="relative h-full w-full  min-h-0 overflow-hidden border viewport-vignette build-scene border-border bg-surface">
      <Canvas
        shadows
        gl={{ toneMappingExposure: 1.2, antialias: true, alpha: true }}
        camera={{
          position: [6.5, 3.5, 7.5],
          fov: 38,
        }}
        dpr={[1, 1.25]}
        className="w-full h-full absolute inset-0"
      >
        {/* <hemisphereLight args={["#f4f7ff", "#8b8174", 1.2]} /> */}

        {/* MAIN KEY */}
        <directionalLight
          castShadow
          position={[6, 7, 6]}
          intensity={3}
          color="#f4efe6"
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={25}
          shadow-bias={-0.0005}
        />
        <Suspense fallback={null}>
          <Environment resolution={128} preset="studio" />
        </Suspense>

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

        <div className="absolute hidden px-4 py-3 border-l-2 cut-corner left-5 top-5 border-accent bg-background/85 backdrop-blur-md sm:block">
          <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-accent-dark">
            Garage / Assembly
          </p>

          <p className="mt-1 text-xl italic font-bold tracking-tight uppercase font-display text-text">
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
            className="cut-corner hidden lg:block accent-glow pointer-events-auto absolute bottom-5 left-1/2 z-20 w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 cursor-pointer border-l-2 border-accent bg-background/90 px-5 py-4 backdrop-blur-md"
          >
            {selectedPart ? (
              <div>
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-accent-dark">
                      Inspecting / {selectedPart.componentType}
                    </p>

                    <p className="mt-1 text-lg italic font-bold uppercase truncate font-display text-text">
                      {selectedPart.name}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-muted">
                      Price
                    </p>
                    <p className="mt-1 font-mono text-base font-bold text-accent-dark">
                      ${selectedPart.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap mt-3 gap-x-4 gap-y-1">
                  {selectedPartHighlights.map((spec) => (
                    <span
                      key={spec.label}
                      title={specDescriptions[spec.label] ?? spec.label}
                      className="font-mono text-[9px] uppercase tracking-wide text-muted"
                    >
                      <span className="text-text">{spec.value}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                <span>Select hardware / Begin assembly</span>
                <span className="hidden sm:block">
                  Drag / Orbit · Scroll / Zoom
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* HEADER */}
      <aside className="cut-corner absolute right-5 top-5 z-20 hidden max-h-[calc(100%-2.5rem)] w-[310px] flex-col overflow-hidden border border-border bg-background/92 shadow-xl backdrop-blur-md lg:flex">
        <div className="px-4 py-4 border-b shrink-0 border-border">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[7px] uppercase tracking-widest text-muted">
                Build status
              </p>
              <h2 className="mt-1 text-xl italic font-bold uppercase font-display text-text">
                Your machine
              </h2>
            </div>
            <div className="flex items-center gap-1.5 border border-accent/30 bg-accent-soft px-2 py-1 font-mono text-[10px] font-bold text-accent-dark">
              <Check className="size-3" />
              {completedParts}/{totalPartCategories}
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden bg-background">
            <div
              className="h-full transition-all duration-300 bg-accent"
              style={{ width: `${buildProgress}%` }}
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
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
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

        <div className="px-4 py-4 border-t shrink-0 border-accent/30 bg-surface">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-accent-dark">
                Build value
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-wide text-muted">
                Current configuration
              </p>
            </div>

            <span className="text-2xl italic font-bold font-display text-text">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </aside>
    </section>
  );
}
