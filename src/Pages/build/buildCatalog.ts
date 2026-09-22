import {
  Box,
  CircuitBoard,
  Cpu,
  Gpu,
  HardDrive,
  MemoryStick,
  PlugZap,
  type LucideIcon,
} from "lucide-react";

import { cases } from "@/data/case";
import { cpus } from "@/data/cpu";
import { gpus } from "@/data/gpu";
import { motherboards } from "@/data/motherboard";
import { psus } from "@/data/psu";
import { ramKits } from "@/data/ram";
import { storageDevices } from "@/data/storage";
import type { CompatibleComponent } from "@/data/type";

export type ComponentGroup = {
  id: string;
  name: string;
  label: string;
  icon: LucideIcon;
  items: CompatibleComponent[];
};

export const componentGroups: ComponentGroup[] = [
  { id: "cpu", name: "CPU", label: "Processor", icon: Cpu, items: cpus },
  { id: "gpu", name: "GPU", label: "Graphics", icon: Gpu, items: gpus },
  {
    id: "motherboard",
    name: "MOTHERBOARD",
    label: "Motherboard",
    icon: CircuitBoard,
    items: motherboards,
  },
  {
    id: "ram",
    name: "MEMORY",
    label: "Memory",
    icon: MemoryStick,
    items: ramKits,
  },
  {
    id: "storage",
    name: "STORAGE",
    label: "Storage",
    icon: HardDrive,
    items: storageDevices,
  },
  {
    id: "psu",
    name: "POWER",
    label: "Power supply",
    icon: PlugZap,
    items: psus,
  },
  { id: "case", name: "CASE", label: "Case", icon: Box, items: cases },
];

export const categoryNames: Record<string, string> = {
  cpu: "Processor bay",
  gpu: "Graphics bay",
  motherboard: "Mainboard tray",
  ram: "Memory bank",
  storage: "Storage array",
  psu: "Power chamber",
  case: "Chassis frame",
};
