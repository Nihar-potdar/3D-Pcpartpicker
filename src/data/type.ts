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
};

export type STORAGE = {
  componentType: "Storage";
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  connecter: string;
  speed: string;
  storagetype: string;
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

export type ComponentType = "CPU" | "RAM" | "GPU" | "Motherboard" | "Case";

export type CompatibilityResult = {
  selectedComponent: string;
  targetComponent: string;
  isCompatible: boolean;
};

export type CompatibilityRule = {
  check: (selectedComponent: any, targetComponent: any) => boolean;
  target: any[];
};
