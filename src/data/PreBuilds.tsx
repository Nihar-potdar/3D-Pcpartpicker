import { cases } from "./case";
import { cpus } from "./cpu";
import { gpus } from "./gpu";
import { motherboards } from "./motherboard";
import { psus } from "./psu";
import { ramKits } from "./ram";
import { storageDevices } from "./storage";
import type { preBuild } from "./type";


function getById<T extends {id: number}> (
    items: T[],
    id: number,
    label: string,
): T {
    const item = items.find((item) => item.id === id);

    if (!item) {
        throw new Error(`${label} with id ${id} was not found`);
    }

    return item;
}

export const prebuilts: preBuild[] = [
  {
    id: "starter-gaming",
    name: "Starter",
    description:
      "Affordable 1080p gaming build with a solid upgrade path.",
    tier: "Starter",
    useCase: ["1080p Gaming", "Everyday Use"],
    build: {
      CPU: getById(cpus, 1, "CPU"),
      GPU: getById(gpus, 6, "GPU"),
      MOTHERBOARD: getById(motherboards, 2, "Motherboard"),
      RAM: getById(ramKits, 1, "RAM"),
      PSU: getById(psus, 2, "PSU"),
      CASE: getById(cases, 9, "Case"),

      STORAGE: [
        {
          instanceId: "starter-storage-1",
          product: getById(storageDevices, 8, "Storage"),
        },
      ],
    },
  },

  {
    id: "balanced-gaming",
    name: "Balanced",
    description:
      "Modern AM5 gaming system aimed at strong 1440p performance.",
    tier: "Balanced",
    useCase: ["1440p Gaming", "General Productivity"],
    build: {
      CPU: getById(cpus, 3, "CPU"),
      GPU: getById(gpus, 8, "GPU"),
      MOTHERBOARD: getById(motherboards, 4, "Motherboard"),
      RAM: getById(ramKits, 6, "RAM"),
      PSU: getById(psus, 5, "PSU"),
      CASE: getById(cases, 8, "Case"),

      STORAGE: [
        {
          instanceId: "balanced-storage-1",
          product: getById(storageDevices, 6, "Storage"),
        },
      ],
    },
  },

  {
    id: "high-end-gaming",
    name: "Apex",
    description:
      "High-end gaming build focused on premium performance and longevity.",
    tier: "High-End",
    useCase: ["High-End Gaming", "4K Gaming"],
    build: {
      CPU: getById(cpus, 4, "CPU"),
      GPU: getById(gpus, 4, "GPU"),
      MOTHERBOARD: getById(motherboards, 3, "Motherboard"),
      RAM: getById(ramKits, 10, "RAM"),
      PSU: getById(psus, 7, "PSU"),
      CASE: getById(cases, 5, "Case"),

      STORAGE: [
        {
          instanceId: "apex-storage-1",
          product: getById(storageDevices, 2, "Storage"),
        },
      ],
    },
  },

  {
    id: "workstation",
    name: "Creator",
    description:
      "High-core-count productivity build for development, rendering and creator workloads.",
    tier: "Workstation",
    useCase: ["Development", "Rendering", "Productivity"],
    build: {
      CPU: getById(cpus, 5, "CPU"),
      GPU: getById(gpus, 3, "GPU"),
      MOTHERBOARD: getById(motherboards, 5, "Motherboard"),
      RAM: getById(ramKits, 10, "RAM"),
      PSU: getById(psus, 6, "PSU"),
      CASE: getById(cases, 6, "Case"),

      STORAGE: [
        {
          instanceId: "creator-storage-1",
          product: getById(storageDevices, 7, "Storage"),
        },
      ],
    },
  },
];