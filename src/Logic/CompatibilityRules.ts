import { motherboards } from "./data/motherboard";
import { ramKits } from "./data/ram";
import { cases } from "./data/case";
import { gpus } from "./data/gpu";

export function compatibilityRules() {
  const motherboardCpuCompatibility: (motherboard: any, cpu: any) => boolean = (
    motherboard,
    cpu,
  ) => {
    const isCpuCompatible = motherboard.socket === cpu.socket;
    return isCpuCompatible;
  };
  const ramMotherboardCompatibility: (ram: any, motherboard: any) => boolean = (
    ram,
    motherboard,
  ) => {
    const isRamCompatible = ram.type === motherboard.ramType;
    return isRamCompatible;
  };
  const gpuCaseCompatibility: (gpu: any, pcCase: any) => boolean = (
    gpu,
    pcCase,
  ) => {
    const isGpuCompatible = pcCase.maxGpuLength >= gpu.length;
    return isGpuCompatible;
  };

  return {
    CPU: {
      check: motherboardCpuCompatibility,
      target: motherboards,
    },
    RAM: {
      check: ramMotherboardCompatibility,
      target: motherboards,
    },
    GPU: {
      check: gpuCaseCompatibility,
      target: cases,
    },
    Motherboard: {
      check: ramMotherboardCompatibility,
      target: ramKits,
    },
    Case: {
      check: gpuCaseCompatibility,
      target: gpus,
    },
  };
}
