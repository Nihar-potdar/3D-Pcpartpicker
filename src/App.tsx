import { useMemo, useState } from "react";

import type {
  CPU,
  GPU,
  RAM,
  Motherboard,
  CASE,
  ComponentType,
} from "./data/type";

import { cpus } from "./data/cpu";
import { gpus } from "./data/gpu";
import { ramKits } from "./data/ram";
import { motherboards } from "./data/motherboard";
import { cases } from "./data/case";

type Component = CPU | GPU | RAM | Motherboard | CASE;

type Category = "All" | ComponentType;

const categories: Category[] = [
  "All",
  "CPU",
  "GPU",
  "Motherboard",
  "RAM",
  "Case",
];


const message ="Hello";

message

function App() {
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null,
  );

  /*
   * Combine all your component arrays into one array.
   *
   * This is only for the UI.
   * Your actual compatibility logic can remain completely separate.
   */
  const allComponents: Component[] = useMemo(
    () => [...cpus, ...gpus, ...motherboards, ...ramKits, ...cases],
    [],
  );

  /*
   * Filter components according to:
   *
   * 1. Selected category
   * 2. Search query
   */
  const filteredComponents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return allComponents.filter((component) => {
      const matchesCategory =
        category === "All" || component.componentType === category;

      const matchesSearch =
        query === "" ||
        component.name.toLowerCase().includes(query) ||
        component.brand.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [allComponents, category, search]);

  /*
   * Current build.
   *
   * Eventually this should probably become a proper Build state/store.
   * For now this is enough for the UI.
   */
  const [build, setBuild] = useState<Partial<Record<ComponentType, Component>>>(
    {},
  );

  function addToBuild(component: Component) {
    setBuild((previous) => ({
      ...previous,
      [component.componentType]: component,
    }));
  }

  const totalPrice = Object.values(build).reduce(
    (total, component) => total + (component?.price ?? 0),
    0,
  );

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(99,102,241,0.08),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(6,182,212,0.05),transparent_30%)]" />

      <div className="pointer-events-none fixed -left-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />

      <div className="pointer-events-none fixed -bottom-40 right-10 h-96 w-96 rounded-full bg-chart-2/10 blur-[120px]" />

      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <header className="sticky top-0 z-50 flex h-18 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            ◈
          </div>

          <div>
            <div className="text-sm font-bold tracking-wide">
              PC<span className="text-primary">FORGE</span>
            </div>

            <div className="font-mono text-[8px] tracking-[0.25em] text-muted-foreground">
              3D CONFIGURATOR
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="hidden w-[420px] items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2 md:flex">
          <span className="text-xl text-muted-foreground">⌕</span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search components..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />

          <kbd className="rounded border border-border px-2 py-1 font-mono text-[9px] text-muted-foreground">
            CTRL K
          </kbd>
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <button className="grid size-10 place-items-center rounded-lg border border-border bg-card/50 transition hover:border-primary/50 hover:bg-primary/10">
            ◌
          </button>

          <button className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card/50 px-2 transition hover:border-primary/50">
            <span className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-primary to-chart-2 text-xs font-bold">
              N
            </span>

            <span className="hidden text-xs sm:block">Nihar</span>

            <span className="text-muted-foreground">⌄</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN */}
      {/* ========================================================= */}

      <section className="mx-auto grid w-[calc(100%-2rem)] max-w-[1500px] grid-cols-1 gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_390px]">
        {/* ===================================================== */}
        {/* LEFT SIDE */}
        {/* ===================================================== */}

        <div className="flex min-w-0 flex-col gap-4">
          {/* 3D VIEWER */}
          <section className="overflow-hidden rounded-xl border border-border bg-card/60 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                  LIVE PREVIEW
                </div>

                <h1 className="mt-1 text-lg font-semibold tracking-tight">
                  Build Studio
                </h1>
              </div>

              <div className="hidden gap-1 sm:flex">
                {["Orbit", "Explode", "Reset"].map((button, index) => (
                  <button
                    key={button}
                    className={[
                      "rounded-md border px-3 py-1.5 text-[10px] transition",
                      index === 0
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background/40 hover:border-primary/50",
                    ].join(" ")}
                  >
                    {button}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D scene placeholder */}
            <div className="relative flex min-h-[540px] items-center justify-center overflow-hidden bg-[#0b0b11]">
              {/* Floor grid */}
              <div
                className="
                  absolute bottom-[-25%] left-[-10%]
                  h-[80%] w-[120%]
                  opacity-10
                  [background-image:linear-gradient(rgba(148,163,184,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.3)_1px,transparent_1px)]
                  [background-size:45px_45px]
                  [transform:perspective(500px)_rotateX(65deg)]
                "
              />

              {/* Glow */}
              <div className="absolute size-[350px] rounded-full bg-primary/10 blur-[80px]" />

              {/* Temporary PC */}
              <div className="relative h-[420px] w-[300px] [transform:perspective(900px)_rotateY(-18deg)_rotateX(3deg)]">
                <div className="absolute inset-0 rounded-xl border border-white/10 bg-gradient-to-r from-[#15151d] to-[#252530] shadow-2xl">
                  <div className="absolute inset-4 overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
                    {/* Motherboard */}
                    <div className="absolute left-8 top-8 h-60 w-36 rounded border border-cyan-400/10 bg-[#10151a]">
                      {/* CPU */}
                      <div className="absolute left-10 top-8 size-14 border border-primary/50 bg-[#191923] shadow-[0_0_20px_rgba(139,92,246,.2)]" />

                      {/* RAM */}
                      <div className="absolute right-5 top-5 flex gap-2">
                        {[1, 2, 3, 4].map((item) => (
                          <div
                            key={item}
                            className="h-24 w-1.5 rounded bg-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,.4)]"
                          />
                        ))}
                      </div>
                    </div>

                    {/* GPU */}
                    <div className="absolute bottom-14 left-10 h-24 w-52 rounded-lg border border-white/10 bg-gradient-to-br from-[#20212b] to-[#111118] shadow-xl">
                      <div className="absolute left-5 top-5 flex gap-5">
                        <div className="grid size-12 place-items-center rounded-full border-[6px] border-[#292b38] bg-[#111118]" />

                        <div className="grid size-12 place-items-center rounded-full border-[6px] border-[#292b38] bg-[#111118]" />
                      </div>

                      <span className="absolute right-3 top-2 font-mono text-[8px] font-bold text-primary">
                        GPU
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected component label */}
              {selectedComponent && (
                <div className="absolute left-5 top-5 rounded-lg border border-primary/20 bg-background/70 px-4 py-3 backdrop-blur-md">
                  <div className="font-mono text-[8px] tracking-widest text-primary">
                    SELECTED
                  </div>

                  <div className="mt-1 text-xs font-semibold">
                    {selectedComponent.name}
                  </div>

                  <div className="mt-1 font-mono text-[8px] text-muted-foreground">
                    {selectedComponent.componentType}
                  </div>
                </div>
              )}

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-muted-foreground">
                ↻ Drag to rotate
              </div>
            </div>

            {/* Viewer footer */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3 font-mono text-[9px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400" />

                {Object.keys(build).length === 0
                  ? "No components selected"
                  : `${Object.keys(build).length} components selected`}
              </div>

              <div className="flex gap-5">
                <span>
                  FPS <strong className="text-foreground">60</strong>
                </span>

                <span>
                  PARTS{" "}
                  <strong className="text-foreground">
                    {Object.keys(build).length}/6
                  </strong>
                </span>
              </div>
            </div>
          </section>

          {/* ===================================================== */}
          {/* BUILD SUMMARY */}
          {/* ===================================================== */}

          <section className="rounded-xl border border-border bg-card/60 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                  CURRENT CONFIGURATION
                </div>

                <h2 className="mt-1 text-lg font-semibold">Build Summary</h2>
              </div>

              <button className="rounded-lg border border-border bg-background/40 px-3 py-2 text-[10px] transition hover:border-primary hover:text-primary">
                Save Build
              </button>
            </div>

            {/* Selected components */}
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {categories
                .filter(
                  (category): category is ComponentType => category !== "All",
                )
                .map((componentType) => {
                  const component = build[componentType];

                  return (
                    <BuildSlot
                      key={componentType}
                      type={componentType}
                      component={component}
                    />
                  );
                })}
            </div>

            {/* Total */}
            <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
              <div>
                <div className="font-mono text-[8px] tracking-wider text-muted-foreground">
                  ESTIMATED TOTAL
                </div>

                <div className="mt-1 text-2xl font-semibold">
                  ${totalPrice.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                  ✓
                </div>

                <div className="hidden sm:block">
                  <div className="text-xs font-semibold">Compatibility</div>

                  <div className="font-mono text-[8px] text-muted-foreground">
                    Engine verification pending
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===================================================== */}
        {/* COMPONENT SIDEBAR */}
        {/* ===================================================== */}

        <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card/60 shadow-xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                COMPONENTS
              </div>

              <h2 className="mt-1 text-lg font-semibold">Parts Library</h2>
            </div>

            <div className="rounded-md border border-border px-2 py-1 font-mono text-[9px] text-muted-foreground">
              {filteredComponents.length}
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-1 overflow-x-auto border-b border-border p-3">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={[
                  "whitespace-nowrap rounded-md border px-2.5 py-1.5 text-[10px] transition",
                  category === item
                    ? "border-primary/40 bg-primary/15 text-primary"
                    : "border-border bg-background/30 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Components */}
          <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto p-3">
            {filteredComponents.map((component) => (
              <ComponentCard
                key={`${component.componentType}-${component.id}`}
                component={component}
                selected={
                  selectedComponent?.id === component.id &&
                  selectedComponent?.componentType === component.componentType
                }
                inBuild={build[component.componentType]?.id === component.id}
                onSelect={() => setSelectedComponent(component)}
                onAdd={() => addToBuild(component)}
              />
            ))}

            {filteredComponents.length === 0 && (
              <div className="flex h-40 items-center justify-center text-center">
                <div>
                  <div className="text-2xl">⌕</div>

                  <div className="mt-2 text-xs font-medium">
                    No components found
                  </div>

                  <div className="mt-1 font-mono text-[8px] text-muted-foreground">
                    Try another search
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected component */}
          {selectedComponent && (
            <div className="m-3 mt-auto rounded-lg border border-primary/20 bg-primary/[0.07] p-4">
              <div className="font-mono text-[8px] tracking-wider text-muted-foreground">
                SELECTED COMPONENT
              </div>

              <div className="mt-1 text-sm font-semibold">
                {selectedComponent.name}
              </div>

              <div className="mt-1 font-mono text-[8px] text-muted-foreground">
                {selectedComponent.componentType}
              </div>

              <div className="mt-1 font-mono text-[9px] text-primary">
                ${selectedComponent.price}
              </div>

              <button
                onClick={() => addToBuild(selectedComponent)}
                className="mt-3 flex h-9 w-full items-center justify-between rounded-lg bg-gradient-to-r from-primary to-chart-2 px-3 text-[10px] font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-0.5"
              >
                {build[selectedComponent.componentType]?.id ===
                selectedComponent.id
                  ? "Selected"
                  : "Add to Build"}

                <span>→</span>
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

/* ============================================================= */
/* COMPONENT CARD */
/* ============================================================= */

function ComponentCard({
  component,
  selected,
  inBuild,
  onSelect,
  onAdd,
}: {
  component: Component;
  selected: boolean;
  inBuild: boolean;
  onSelect: () => void;
  onAdd: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={[
        "group flex w-full cursor-pointer gap-3 rounded-lg border p-2 text-left transition",
        selected
          ? "border-primary/40 bg-primary/[0.07]"
          : "border-transparent bg-background/[0.025] hover:-translate-y-0.5 hover:border-primary/30 hover:bg-background/[0.05]",
      ].join(" ")}
    >
      {/* Image */}
      <div className="relative size-[78px] shrink-0 overflow-hidden rounded-md bg-background">
        <img
          src={component.image}
          alt={component.name}
          className="size-full object-cover opacity-70 transition group-hover:scale-105 group-hover:opacity-100"
        />

        {/* Component type */}
        <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[7px] text-white backdrop-blur">
          {component.componentType}
        </span>
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="font-mono text-[8px] uppercase tracking-wider text-primary">
          {component.brand}
        </span>

        <strong className="mt-0.5 truncate text-xs">{component.name}</strong>

        <ComponentSpecs component={component} />

        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold">
            ${component.price}
          </span>

          <button
            onClick={(event) => {
              event.stopPropagation();
              onAdd();
            }}
            className={[
              "text-[9px] transition",
              inBuild
                ? "text-emerald-400"
                : "text-primary hover:text-primary/70",
            ].join(" ")}
          >
            {inBuild ? "✓ Added" : "Add +"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================= */
/* COMPONENT-SPECIFIC DATA */
/* ============================================================= */

function ComponentSpecs({ component }: { component: Component }) {
  switch (component.componentType) {
    case "CPU":
      return (
        <span className="mt-0.5 font-mono text-[8px] text-muted-foreground">
          {component.cores}C / {component.threads}T · {component.socket} ·{" "}
          {component.tdp}W
        </span>
      );

    case "GPU":
      return (
        <span className="mt-0.5 font-mono text-[8px] text-muted-foreground">
          {component.vram}GB VRAM · {component.length}mm · {component.tdp}W
        </span>
      );

    case "RAM":
      return (
        <span className="mt-0.5 font-mono text-[8px] text-muted-foreground">
          {component.capacity}GB · {component.type} · {component.speed}MHz
        </span>
      );

    case "Motherboard":
      return (
        <span className="mt-0.5 font-mono text-[8px] text-muted-foreground">
          {component.socket} · {component.ramType} · {component.formFactor}
        </span>
      );

    case "Case":
      return (
        <span className="mt-0.5 font-mono text-[8px] text-muted-foreground">
          {component.formFactor} · GPU ≤ {component.maxGpuLength}mm
        </span>
      );

    default:
      return null;
  }
}

/* ============================================================= */
/* BUILD SLOT */
/* ============================================================= */

function BuildSlot({
  type,
  component,
}: {
  type: ComponentType;
  component?: Component;
}) {
  return (
    <div
      className={[
        "rounded-lg border p-3",
        component
          ? "border-primary/20 bg-primary/[0.04]"
          : "border-border bg-background/[0.025]",
      ].join(" ")}
    >
      <div className="font-mono text-[8px] tracking-wider text-muted-foreground">
        {type}
      </div>

      {component ? (
        <div className="mt-2 flex items-center gap-2">
          <img
            src={component.image}
            alt={component.name}
            className="size-10 rounded object-cover"
          />

          <div className="min-w-0">
            <div className="truncate text-[10px] font-semibold">
              {component.name}
            </div>

            <div className="font-mono text-[8px] text-muted-foreground">
              ${component.price}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 font-mono text-[9px] text-muted-foreground">
          + Add {type}
        </div>
      )}
    </div>
  );
}

export default App;
