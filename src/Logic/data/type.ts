export type CPU = {
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
