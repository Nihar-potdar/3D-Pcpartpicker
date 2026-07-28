import { cpus }from "./data/CPU";
import { motherboards } from "./data/MOTHERBOARD";
import { ram } from "./data/RAM";

export function MoboCpuCompatible() {
  const cpu = cpus.map((cpu, index) => `${index + 1} ${cpu.name}`).join("\n");
  const cpuSelect = prompt(`choose a cpu: ${cpu}`);

  if (cpuSelect == null) {
    console.log("input null");
    return;
  }

  const selectionIndex = parseInt(cpuSelect) - 1;
  if (!cpus[selectionIndex]) {
    console.log("invalid input");
    return;
  }
  const selectedCpu = cpus[selectionIndex];

  const results = motherboards.map((board) => {
    const isCompatible = board.socket === selectedCpu.socket;
    return {
      cpu: selectedCpu.name,
      compatibility: isCompatible,
      motherboard: `${board.name}`,
    };
  });

  console.log(results);
  // return results;
}

export function MoboRamCompatible() {
  const rams = ram.map((ram, index) => `${index + 1} ${ram.name}`).join("\n");
  const ramSelect = prompt(`Choose Ram: ${rams}`);

  if (ramSelect == null) {
    console.log("invalid entry: NULL");
    return;
  }

  const selectedIndex = parseInt(ramSelect) - 1;

  if (!ram[selectedIndex]) {
    console.log("Invalid output");
    return;
  }

  const selectedRam = ram[selectedIndex];

  const results = motherboards.map((board) => {
    const isCompatible = board.ramType === selectedRam.type;
    return {
      isCompatible: isCompatible,
      motherboard: board.name,
      ram: selectedRam.name,
    };
  });
  console.log(results);
  // return results;
}
