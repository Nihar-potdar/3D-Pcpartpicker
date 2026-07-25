import type { GPU } from "@/Logic/data/type"

export const gpus: GPU[] = [
  {
    id: 1,
    name: "RTX 4060",
    brand: "NVIDIA",
    image: "/gpu/4060.png",
    price: 28999,
    chipset: "Ada Lovelace",
    vram: 8,
    tdp: 115,
    length: 245,
    performanceScore: 74,
  },
  {
    id: 2,
    name: "RTX 4070 SUPER",
    brand: "NVIDIA",
    image: "/gpu/4070super.png",
    price: 59999,
    chipset: "Ada Lovelace",
    vram: 12,
    tdp: 220,
    length: 261,
    performanceScore: 91,
  },
];
