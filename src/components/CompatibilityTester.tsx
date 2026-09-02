import { useState } from "react";
import { cpus } from "../data/cpu";
import { motherboards } from "../data/motherboard";
import { ramKits } from "../data/ram";
import { gpus } from "../data/gpu";
import { cases } from "../data/case";
import { storageDevices } from "../data/storage";
import { validateBuild } from "../Logic/Compatibility/Compatibility";
import type { CompatibleComponent, CompatibilityResult, ComponentType } from "../data/type";

const componentOptions: Record<ComponentType, CompatibleComponent[]> = {
  CPU: cpus,
  Motherboard: motherboards,
  RAM: ramKits,
  GPU: gpus,
  Case: cases,
  Storage: storageDevices,
};

const componentTypes: ComponentType[] = ["CPU", "Motherboard", "RAM", "GPU", "Case", "Storage"];

export default function CompatibilityTester() {
  const [selectedIds, setSelectedIds] = useState<Partial<Record<ComponentType, string>>>({});

  const [results, setResults] = useState<CompatibilityResult[] | null>(null);

  function handleValidate() {
    const selectedBuild = componentTypes.flatMap((type) => {
      const selectedId = selectedIds[type];

      if (!selectedId) return [];

      const component = componentOptions[type].find((option) => option.id === Number(selectedId));

      return component ? [component] : [];
    });

    setResults(validateBuild(selectedBuild));
  }

  return (
    <main>
      <h1>Build Compatibility Tester</h1>

      {componentTypes.map((type) => (
        <label key={type} style={{ display: "block", marginBottom: 12 }}>
          {type}:{" "}
          <select
            className="rounded-md border border-slate-700 bg-black px-3 py-2 text-white scheme:dark"
            value={selectedIds[type] ?? ""}
            onChange={(event) =>
              setSelectedIds((current) => ({
                ...current,
                [type]: event.target.value,
              }))
            }
          >
            <option value="" className="bg-black text-white">
              Choose {type}
            </option>

            {componentOptions[type].map((component) => (
              <option
                key={`${type}-${component.id}`}
                value={component.id}
                className="bg-black text-white"
              >
                {component.name}
              </option>
            ))}
          </select>
        </label>
      ))}

      <button type="button" onClick={handleValidate}>
        Validate Build
      </button>

      {results && (
        <section>
          <h2>Results</h2>

          {results.length === 0 ? (
            <p>Select the parts required for a comparison.</p>
          ) : (
            <ul>
              {results.map((result, index) => (
                <li
                  key={`${result.selectedComponent}-${result.targetComponent}-${index}`}
                  style={{
                    color: result.isCompatible ? "green" : "red",
                  }}
                >
                  {result.selectedComponent} + {result.targetComponent}:{" "}
                  {result.isCompatible ? "Compatible" : "Not compatible"}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
