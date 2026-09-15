import { compatibilityRules } from "./CompatibilityRules";
import type { CompatibleComponent, CompatibilityResult, ComponentType, BUILD } from "../../data/type";

// this is the remove duplicate component validation types. Controls which selected component starts a check.
const BUILD_VALIDATION_SOURCES: ComponentType[] = ["CPU", "RAM", "GPU", "Storage", "PSU", "Case"];

// importing Rules used in compatibilty engine
const RULES = compatibilityRules();

// Adapter.

export function buildToComponents(build: BUILD): CompatibleComponent[]{

  const singleParts: Array<CompatibleComponent | undefined> = [
    build.CPU,
    build.GPU,
    build.RAM,
    build.PSU,
    build.CASE,
    build.MOTHERBOARD,
  ];

  const selectedParts = singleParts.filter(
    (part): part is CompatibleComponent => part !== undefined,
  );

  const storageParts = build.STORAGE.map((drive) => drive.product);

  return [...selectedParts, ...storageParts];
}
 
// Checks one components against every single other component in the database (component compatibility is defined in CompatibliityRules.tsx). can be used when user is choosing componets and for filtering incompatible components

export function compatibilityEngine(
  selectedComponent: CompatibleComponent,
  chosenComponents?: CompatibleComponent[]
): CompatibilityResult[] {
  const rule = RULES[selectedComponent.componentType];

  if (!rule) return [];

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
  console.log(selectedComponent);
  return selectedComponent
    .filter((component) => BUILD_VALIDATION_SOURCES.includes(component.componentType))
    .flatMap((component) => compatibilityEngine(component, selectedComponent));
}