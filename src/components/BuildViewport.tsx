import { Float, Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { CompatibleComponent } from "@/data/type";

/** Data supplied by the Build page to keep Three.js independent of routing. */
type BuildViewportProps = {
  selectedCategory: string;
  selectedPart: CompatibleComponent | null;
};

/**
 * Draws a lightweight wireframe PC case as the viewport's orientation anchor.
 *
 * Primitive geometry was chosen instead of a downloaded model so the workspace
 * remains fast and reliable while real product-model mapping is still pending.
 * The dimensions are visual proportions, not physical compatibility values.
 *
 * @param {{ reduceMotion: boolean }} props - Accessibility flag controlling the
 * optional idle float and rotation applied by `@react-three/drei`.
 * @returns {JSX.Element} A group of Three.js meshes representing a case shell.
 * @remarks This component does not intentionally throw; WebGL render errors are
 * propagated by React Three Fiber.
 */
function CaseBlueprint({ reduceMotion }: { reduceMotion: boolean }) {
  // Setting every motion intensity to zero preserves the same scene graph for
  // reduced-motion users instead of maintaining a second render path.
  return (
    <Float
      speed={reduceMotion ? 0 : 0.55}
      rotationIntensity={reduceMotion ? 0 : 0.08}
      floatIntensity={reduceMotion ? 0 : 0.18}
    >
      <group position={[0, 0.15, 0]} rotation={[0.02, -0.42, 0]}>
        {/* Outer chassis: wireframe keeps the grid and internal bays visible. */}
        <mesh>
          <boxGeometry args={[3.8, 4.6, 2.4]} />
          <meshBasicMaterial
            color="#5d6b82"
            wireframe
            transparent
            opacity={0.44}
          />
        </mesh>

        {/* Rear motherboard tray: a translucent plane establishes depth. */}
        <mesh position={[0, 0.25, -0.88]}>
          <boxGeometry args={[3.15, 3.45, 0.08]} />
          <meshBasicMaterial color="#5d6b82" transparent opacity={0.18} />
        </mesh>

        {/* Mainboard placeholder: intentionally distinct from the case shell. */}
        <mesh position={[-0.2, 0.55, -0.75]}>
          <boxGeometry args={[1.9, 2.2, 0.15]} />
          <meshBasicMaterial
            color="#77736b"
            wireframe
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* Lower power-supply chamber helps the silhouette read as a PC case. */}
        <mesh position={[0.25, -1.45, 0.35]}>
          <boxGeometry args={[2.75, 0.72, 1.55]} />
          <meshBasicMaterial
            color="#77736b"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Horizontal expansion card suggests the future GPU placement area. */}
        <mesh position={[0.1, 0.28, 0.12]}>
          <boxGeometry args={[2.65, 0.45, 0.62]} />
          <meshBasicMaterial
            color="#5d6b82"
            wireframe
            transparent
            opacity={0.62}
          />
        </mesh>
      </group>
    </Float>
  );
}

/**
 * Hosts the large 3D assembly area and its HTML information overlay.
 *
 * React Three Fiber owns the WebGL canvas, Drei provides the infinite grid and
 * orbit controls, and Motion animates only the selected-part readout. Product
 * data is read-only here; persistence and compatibility belong to build logic.
 *
 * @param {BuildViewportProps} props - Human-readable active category and the
 * optional product currently being inspected.
 * @returns {JSX.Element} An orbitable 3D viewport with accessible status text.
 * @throws {Error} WebGL context or Three.js render failures may propagate to the
 * nearest React error boundary on unsupported devices.
 */
export function BuildViewport({
  selectedCategory,
  selectedPart,
}: BuildViewportProps) {
  // The OS/browser accessibility preference controls the purely decorative
  // idle movement; manual orbit and zoom remain available for exploration.
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-0 flex-1 overflow-hidden border border-border bg-surface">
      {/* The camera begins outside the whole wireframe so users understand the
          object before orbiting it. Pixel density is capped to protect GPU
          performance without making thin lines rough on common displays. */}
      <Canvas
        camera={{ position: [7.2, 4.8, 8.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        className="bg-[radial-gradient(circle_at_50%_42%,var(--color-accent-soft),transparent_62%)]"
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[6, 8, 4]} intensity={1.2} />

        {/* A horizontal infinite grid creates genuine 3D perspective and is
            visually denser than the flat 2D grid used on landing pages. */}
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

        <CaseBlueprint reduceMotion={Boolean(shouldReduceMotion)} />
        {/* Damping makes direct manipulation feel controlled; distance and
            polar limits stop users losing the model or going below the floor. */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={5}
          maxDistance={17}
          maxPolarAngle={Math.PI / 2.05}
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
    </section>
  );
}
