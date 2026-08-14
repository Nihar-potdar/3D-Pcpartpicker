import { motherboards } from "../../data/motherboard";
import { ramKits } from "../../data/ram";
import { cases } from "../../data/case";
import { gpus } from "../../data/gpu";
import type { CASE, CPU, Motherboard, RAM, GPU } from "../../data/type";
import type { ComponentType, CompatibilityRule } from "../../data/type";

export function compatibilityRules() {
  const motherboardCpuCompatibility: (
    motherboard: Motherboard,
    cpu: CPU,
  ) => boolean = (motherboard, cpu) => {
    const isCpuCompatible = motherboard.socket === cpu.socket;
    return isCpuCompatible;
  };
  const ramMotherboardCompatibility: (
    ram: RAM,
    motherboard: Motherboard,
  ) => boolean = (ram, motherboard) => {
    const isRamCompatible = ram.type === motherboard.ramType;
    return isRamCompatible;
  };
  const gpuCaseCompatibility: (gpu: GPU, pcCase: CASE) => boolean = (
    gpu,
    pcCase,
  ) => {
    const isGpuCompatible = pcCase.maxGpuLength >= gpu.length;
    return isGpuCompatible;
  };

  const RULES: Record<ComponentType, CompatibilityRule> = {
    CPU: {
      check: (cpu: CPU, motherboard: Motherboard) =>
        motherboardCpuCompatibility(motherboard, cpu),
      target: motherboards,
    },

    Motherboard: {
      check: (motherboard: Motherboard, ram: RAM) =>
        ramMotherboardCompatibility(ram, motherboard),
      target: ramKits,
    },

    RAM: {
      check: (ram: RAM, motherboard: Motherboard) =>
        ramMotherboardCompatibility(ram, motherboard),
      target: motherboards,
    },

    GPU: {
      check: (gpu: GPU, pcCase: CASE) => gpuCaseCompatibility(gpu, pcCase),
      target: cases,
    },

    Case: {
      check: (pcCase: CASE, gpu: GPU) => gpuCaseCompatibility(gpu, pcCase),
      target: gpus,
    },
  };
  return RULES;
}
