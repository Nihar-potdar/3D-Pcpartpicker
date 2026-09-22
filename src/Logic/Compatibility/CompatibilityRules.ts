import { motherboards } from "../../data/motherboard";
import { ramKits } from "../../data/ram";
import { cases } from "../../data/case";
import { gpus } from "../../data/gpu";
import type { CASE, CPU, Motherboard, RAM, GPU, STORAGE, PSU } from "../../data/type";
import type { ComponentType, CompatibilityRule, RuleCheckResult } from "../../data/type";

// motherboard-case form factor hierarchy

const formFactorSize = {
  "Mini ITX": 1,
  "Micro ATX": 2,
  "ATX": 3
}

export function compatibilityRules() {
    

const motherboardCpuCompatibility = (
  motherboard: Motherboard,
  cpu: CPU,
): RuleCheckResult => {
  const isCompatible = motherboard.socket === cpu.socket;

  if (isCompatible) {
    return {
      isCompatible: true,
    };
  }
  return {
    isCompatible: false,
    error: {
      type: "error",
      rule: "CPU_MOTHERBOARD_SOCKET",
      title: "CPU and motherboard sockets do not match",
      compatibilityIssue:
        `${cpu.name} uses socket ${cpu.socket}, but ` +
        `${motherboard.name} uses socket ${motherboard.socket}.`,

      source: {
        id: cpu.id,
        name: cpu.name,
        componentType: cpu.componentType,
        value: cpu.socket,
      },

      target: {
        id: motherboard.id,
        name: motherboard.name,
        componentType: motherboard.componentType,
        value: motherboard.socket,
      },

      suggestedAction: "MOTHERBOARD",
    },
  };
};



  const ramMotherboardCompatibility: (ram: RAM, motherboard: Motherboard) => boolean = (
    ram,
    motherboard
  ) => {
    const isRamCompatible = ram.type === motherboard.ramType;
   if (isRamCompatible === false) {
      console.log("choose the same DDR generation for both motherbard/RAM")
    }
    return isRamCompatible;
  };
  const gpuCaseCompatibility: (gpu: GPU, pcCase: CASE) => boolean = (gpu, pcCase) => {
    const isGpuCompatible = pcCase.maxGpuLength >= gpu.length;
     if (isGpuCompatible === false) {
      console.log("choose a case with enough GPU clearance")
    }
    return isGpuCompatible;
  };
  const storageCompatibility: (storageDevices: STORAGE, motherboard: Motherboard) => boolean = (
    storageDevices,
    motherboards
  ) => {
    // Checks Connector
    const hasConnector =
      storageDevices.connector === "M.2" ? motherboards.m2Slots > 0 : motherboards.sataPorts > 0;

    // Checks Protocol
    const supportsProtocol =
      storageDevices.connector === "M.2"
        ? motherboards.supportedM2Protocols.includes(storageDevices.protocol)
        : storageDevices.protocol === "SATA";

    const isStorageCompatible = hasConnector && supportsProtocol;

    return isStorageCompatible;
  };

  const calculatePsuHeadroom: (psu: PSU, gpu: GPU) => number = (psu, gpu) => {
    const headroom = psu.wattage - gpu.tdp;
    return headroom;
  };

  const psuCompatibility: (psu: PSU, gpu: GPU) => boolean = (psu, gpu) => {
    const headroom = calculatePsuHeadroom(psu, gpu);
    const isCompatible = headroom >= 200;

    return isCompatible;
  };

  // TODO: trying out new funcitonality in the belwo funciton
  const motherboardCaseCompatibility = (pcCase: CASE, motherboard: Motherboard): boolean => {
    return formFactorSize[pcCase.formFactor] >= formFactorSize[motherboard.formFactor];
  };

  const RULES: Partial<Record<ComponentType, CompatibilityRule>> = {
    CPU: {
      check: (cpu: CPU, motherboard: Motherboard) => motherboardCpuCompatibility(motherboard, cpu),
      target: motherboards,
    },

    Motherboard: {
      check: (motherboard: Motherboard, ram: RAM) => ramMotherboardCompatibility(ram, motherboard),
      target: ramKits,
    },

    RAM: {
      check: (ram: RAM, motherboard: Motherboard) => ramMotherboardCompatibility(ram, motherboard),
      target: motherboards,
    },

    GPU: {
      check: (gpu: GPU, pcCase: CASE) => gpuCaseCompatibility(gpu, pcCase),
      target: cases,
    },
    Storage: {
      check: (storageDevices: STORAGE, motherboard: Motherboard) =>
        storageCompatibility(storageDevices, motherboard),
      target: motherboards,
    },
    PSU: {
      check: (psu: PSU, gpu: GPU) => psuCompatibility(psu, gpu),
      target: gpus,
    },
    Case: {
      check: (cases: CASE, motherboard: Motherboard) =>
        motherboardCaseCompatibility(cases, motherboard),
      target: motherboards,
    },
  };
  return RULES;
}
