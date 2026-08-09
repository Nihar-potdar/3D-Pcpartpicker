"use client";

import { useState } from "react";
import { cpus } from "@/Logic/data/cpu";
import { motherboards } from "@/Logic/data/motherboard";
import { ramKits } from "@/Logic/data/ram";
import { compatibilityEngine } from "@/Logic/Compatibility";

export default function CompatibilityTester() {
  const [componentType, setComponentType] = useState("CPU");
  const [selectedIndex, setSelectedIndex] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const components = {
    CPU: cpus,
    Motherboard: motherboards,
    RAM: ramKits,
  };

  const selectedComponents =
    components[componentType as keyof typeof components];

  function handleCheck() {
    if (selectedIndex === "") return;

    const selectedComponent =
      selectedComponents[Number(selectedIndex)];

    const result = compatibilityEngine(selectedComponent);

    setResults(result);
  }

  return (
    <div>
      <h1>Compatibility Engine Tester</h1>

      <select
        value={componentType}
        onChange={(e) => {
          setComponentType(e.target.value);
          setSelectedIndex("");
          setResults([]);
        }}
      >
        <option value="CPU">CPU</option>
        <option value="Motherboard">Motherboard</option>
        <option value="RAM">RAM</option>
      </select>

      <select
        value={selectedIndex}
        onChange={(e) => setSelectedIndex(e.target.value)}
      >
        <option value="">Choose component</option>

        {selectedComponents.map((component, index) => (
          <option key={index} value={index}>
            {component.name}
          </option>
        ))}
      </select>

      <button onClick={handleCheck}>
        Check Compatibility
      </button>

      <pre>
        {JSON.stringify(results, null, 2)}
      </pre>
    </div>
  );
}
