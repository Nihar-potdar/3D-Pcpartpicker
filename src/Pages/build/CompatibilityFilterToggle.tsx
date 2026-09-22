export type CompatibilityFilterMode = "all" | "compatible";

type CompatibilityFilterToggleProps = {
  value: CompatibilityFilterMode;
  onChange: (value: CompatibilityFilterMode) => void;
};

export function CompatibilityFilterToggle({
  value,
  onChange,
}: CompatibilityFilterToggleProps) {
  return (
    <div
      className="grid grid-cols-2 border border-border bg-background"
      aria-label="Compatibility filter"
    >
      <button
        type="button"
        aria-pressed={value === "all"}
        onClick={() => onChange("all")}
        className={`px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider transition ${
          value === "all"
            ? "bg-accent text-white"
            : "text-muted hover:bg-surface hover:text-text"
        }`}
      >
        All parts
      </button>

      <button
        type="button"
        aria-pressed={value === "compatible"}
        onClick={() => onChange("compatible")}
        className={`border-l border-border px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider transition ${
          value === "compatible"
            ? "bg-green-500 text-black"
            : "text-muted hover:bg-surface hover:text-text"
        }`}
      >
        Compatible only
      </button>
    </div>
  );
}
