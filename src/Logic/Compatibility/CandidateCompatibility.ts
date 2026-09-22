import type { BUILD, CompatibleComponent, DetailedErrors } from "@/data/type";
import { buildToComponents, getDetailedErrors } from "./Compatibility";

export function buildWithCandidate(
  currentBuild: BUILD,
  candidate: CompatibleComponent,
): BUILD {
  switch (candidate.componentType) {
    case "CPU":
      return {
        ...currentBuild,
        CPU: candidate,
      };
    case "GPU":
      return {
        ...currentBuild,
        GPU: candidate,
      };

    case "RAM":
      return {
        ...currentBuild,
        RAM: candidate,
      };

    case "PSU":
      return {
        ...currentBuild,
        PSU: candidate,
      };

    case "Case":
      return {
        ...currentBuild,
        CASE: candidate,
      };

    case "Motherboard":
      return {
        ...currentBuild,
        MOTHERBOARD: candidate,
      };
    case "Storage":
      return {
        ...currentBuild,
        STORAGE: [
          ...currentBuild.STORAGE,
          {
            instanceId: `compatibility-preview-${candidate.id}`,
            product: candidate,
          },
        ],
      };
  }
}

function errorInvolvesCandidate(
  error: DetailedErrors,
  candidate: CompatibleComponent,
): boolean {
  const candidateIsSource =
    error.source.id === candidate.id &&
    error.source.componentType === candidate.componentType;

  const candidateIsTarget =
    error.target.id === candidate.id &&
    error.target.componentType === candidate.componentType;

  return candidateIsSource || candidateIsTarget;
}

export function getCandidateCompatibilityIssues(
  currentBuild: BUILD,
  candidate: CompatibleComponent,
): DetailedErrors[] {
  const proposedBuild = buildWithCandidate(currentBuild, candidate);

  const allIssues = getDetailedErrors(buildToComponents(proposedBuild));

  return allIssues.filter((issue) =>
    errorInvolvesCandidate(issue, candidate),
  );
}

export function isCandidateCompatible(
  currentBuild: BUILD,
  candidate: CompatibleComponent,
): boolean {
  return getCandidateCompatibilityIssues(currentBuild, candidate).length === 0;
}

export function componentKey(component: CompatibleComponent): string {
  return `${component.componentType}-${component.id}`;
}
