import { compatibilityRules } from "./CompatibilityRules";
import type { CompatibleComponent, CompatibilityResult, ComponentType } from "../../data/type";

// this is the remove duplicate component validation types. Controls which selected component starts a check.
const BUILD_VALIDATION_SOURCES: ComponentType[] = ["CPU", "RAM", "GPU", "Storage"];

// importing Rules used in compatibilty engine
const RULES = compatibilityRules();

// Checks one components against every single other component in the database (component compatibility is defined in CompatibliityRules.tsx). can be used when user is choosing componets and for filtering incompatible components

export function compatibilityEngine(
  selectedComponent: CompatibleComponent,
  chosenComponents?: CompatibleComponent[]
): CompatibilityResult[] {
  const rule = RULES[selectedComponent.componentType];

  const targets = chosenComponents
    ? rule.target.filter((databaseTarget) =>
        chosenComponents.some(
          (chosen) =>
            chosen.componentType === databaseTarget.componentType && chosen.id === databaseTarget.id
        )
      )
    : rule.target;

  return targets.map((targetComponent) => {
    const isCompatible = rule.check(selectedComponent, targetComponent);
    return {
      selectedComponent: selectedComponent.name,
      targetComponent: targetComponent.name,
      isCompatible,
    };
  });
}

// Checks the build with the components chosen by the user. should be used when the user has CHOSEN a component. this DEPENDS on the compatibiltyEngine() above.

export function validateBuild(selectedComponent: CompatibleComponent[]): CompatibilityResult[] {
  return selectedComponent
    .filter((component) => BUILD_VALIDATION_SOURCES.includes(component.componentType))
    .flatMap((component) => compatibilityEngine(component, selectedComponent));
}

// this was the old implementation of the compatibility engine, which was replaced by the new one above. The old implementation was more verbose and less efficient, as it had separate logic for each component type. The new implementation uses a more generic approach, which makes it easier to maintain and extend in the future.

// if (selectedComponent.componentType === RULES.CPU.source) {
//   const cpuResult = motherboards.map((board) => {
//     const isCpuCompatible = RULES.CPU.check(board, selectedComponent);
//     return {
//       CPU: selectedComponent.name,
//       MotherBoard: board.name,
//       isCpuCompatible: isCpuCompatible,
//     };
//   });

//   console.log(cpuResult);
//   console.log(selectedComponent.componentType);
//   console.log(selectedComponent.name);
//   return cpuResult;
// } else if (selectedComponent.componentType === RULES.Motherboard.source) {
//   const motherboardresult = ramKits.map((ram) => {
//     const isRamCompatible = RULES.Motherboard.check(ram, selectedComponent);
//     return {
//       MotherBoard: selectedComponent.name,
//       RAM: ram.name,
//       isRamCompatible: isRamCompatible,
//     };
//   });
//   console.log(motherboardresult);
//   return motherboardresult;
// } else if (selectedComponent.componentType === RULES.RAM.source) {
//   const ramResult = motherboards.map((board) => {
//     const isRamCompatible = RULES.RAM.check(selectedComponent, board);
//     return {
//       RAM: selectedComponent.name,
//       MotherBoard: board.name,
//       isRamCompatible: isRamCompatible,
//     };
//   });
//   console.log(ramResult);
//   return ramResult;
// } else if (selectedComponent.componentType === RULES.GPU.source) {
//   const gpuResult = cases.map((pcCase) => {
//     const isGpuCompatible = RULES.GPU.check(selectedComponent, pcCase);
//     return {
//       GPU: selectedComponent.name,
//       Case: pcCase.name,
//       isGpuCompatible: isGpuCompatible,
//     };
//   });
//   console.log(gpuResult);
//   return gpuResult;
// } else if (selectedComponent.componentType === RULES.Case.source) {
//   const caseResult = gpus.map((gpu) => {
//     const isGpuCompatible = RULES.GPU.check(gpu, selectedComponent);
//     return {
//       GPU: gpu.name,
//       Case: selectedComponent.name,
//       isGpuCompatible: isGpuCompatible,
//     };
//   });
//   console.log(caseResult);
//   return caseResult;
// }
