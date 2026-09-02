// the whole build type... can be used for prebuilds as well as custom build validation
export type BUILD = {
  RAM?: RAM;
  CPU?: CPU;
  GPU?: GPU;
  CASE?: CASE;
  STORAGE?: STORAGE[];
  MOTHERBOARD?: Motherboard;
};

export type CPU = {
  componentType: "CPU";
  id: number;
  name: string;
  brand: "AMD" | "Intel";
  image: string;
  price: number;
  socket: string;
  cores: number;
  threads: number;
  baseClock: number;
  boostClock: number;
  tdp: number;
  integratedGraphics: boolean;
  performanceScore: number;
};

export type GPU = {
  componentType: "GPU";
  id: number;
  name: string;
  brand: "NVIDIA" | "AMD";
  image: string;
  price: number;
  chipset: string;
  vram: number;
  tdp: number;
  length: number;
  performanceScore: number;
};

export type RAM = {
  componentType: "RAM";
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  type: "DDR4" | "DDR5";
  capacity: number;
  speed: number;
  modules: string;
  rgb: boolean;
};

// Standard Protocol type for motherboard and Storage
export type StorageProtocol = "NVMe" | "SATA";

export type Motherboard = {
  componentType: "Motherboard";
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  socket: string;
  chipset: string;
  formFactor: "ATX" | "Micro ATX" | "Mini ITX";
  ramType: "DDR4" | "DDR5";
  wifi: boolean;
  m2Slots: number;
  sataPorts: number;
  supportedM2Protocols: StorageProtocol[];
};

export type STORAGE = {
  componentType: "Storage";
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  storageType: "SSD" | "HDD";
  connector: "M.2" | "SATA";
  protocol: StorageProtocol;
  formFactor: "M.2 2280" | "2.5-inch" | "3.5-inch";
  capacityGB: number;
  readSpeedMBps: number;
  writeSpeedMBps: number;
};

export type CASE = {
  componentType: "Case";
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  formFactor: "ATX" | "Micro ATX" | "Mini ITX";
  maxGpuLength: number; // mm
  maxCoolerHeight: number; // mm
  radiatorSupport: string; // e.g. "240mm", "360mm"
  color: string;
  rgb: boolean;
  temperedGlass: boolean;
};

export type ComponentType = "CPU" | "RAM" | "GPU" | "Motherboard" | "Case" | "Storage";

export type CompatibleComponent = CPU | GPU | RAM | Motherboard | CASE | STORAGE;

export type CompatibilityResult = {
  selectedComponent: string;
  targetComponent: string;
  isCompatible: boolean;
};

type CompatibilityCheck = {
  bivarianceHack(
    selectedComponent: CompatibleComponent,
    targetComponent: CompatibleComponent
  ): boolean;
}["bivarianceHack"];

export type CompatibilityRule = {
  check: CompatibilityCheck;
  target: CompatibleComponent[];
};
