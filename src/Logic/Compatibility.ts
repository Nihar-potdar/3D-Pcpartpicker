import { cpus } from "./data/cpu";
import { motherboards } from "./data/motherboard";
import { ramKits } from "./data/ram";
import { cases } from "./data/case";

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
      isCompatible: isCompatible,
      motherboard: `${board.name}`,
    };
  });

  console.log(results);
  return results;
}

export function MoboRamCompatible() {
  const rams = ramKits
    .map((ram, index) => `${index + 1} ${ram.name}`)
    .join("\n");
  const ramSelect = prompt(`Choose Ram: ${rams}`);

  if (ramSelect == null) {
    console.log("invalid entry: NULL");
    return;
  }

  const selectedIndex = parseInt(ramSelect) - 1;

  if (!ramKits[selectedIndex]) {
    console.log("Invalid output");
    return;
  }

  const selectedRam = ramKits[selectedIndex];

  const results = motherboards.map((board) => {
    const isCompatible = board.ramType === selectedRam.type;
    return {
      isCompatible: isCompatible,
      motherboard: board.name,
      ram: selectedRam.name,
    };
  });
  // console.log(results);
  return results;
}




// take in mobo input
// safety check the input
// loop through the Cases through the .map() func and output to a new array
// return the Mobo name - isCompatible - Case name
export function MoboCaseCompatibile() {
  const motherboard = motherboards
    .map((motherboard, index) => `${index + 1} ${motherboard.name}`)
    .join("\n");
  const motherboardSelect = prompt(`Choose a Motherboard:${motherboard}`);

  if (motherboardSelect == null) {
    console.log("invalid: NULL");
    return;
  }
  const selectedIndex = parseInt(motherboardSelect) - 1;

  if (!motherboards[selectedIndex]) {
    console.log("Invalid output");
    return;
  }
  const selectedMotherBoard = motherboards[selectedIndex];

  const results = cases.map((pccase) => {
    const isCompatible = pccase.formFactor === selectedMotherBoard.formFactor;
    return {
      isCompatible,
      case: pccase.name,
      motherboard: selectedMotherBoard.name,
    };
  });

  console.log(results);
  return results;
}



// GOAL: to check if the CPU is compatible with the ram

//steps
//Take in a CPU input
//




