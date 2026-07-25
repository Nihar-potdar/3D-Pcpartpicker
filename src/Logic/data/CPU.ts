import type { CPU } from "@/Logic/data/type"

 const cpus: CPU[] = [
  {
    id: 1,
    name: "AMD Ryzen 5 5600",
    brand: "AMD",
    image: "/cpu/ryzen5600.png",
    price: 10999,
    socket: "AM4",
    cores: 6,
    threads: 12,
    baseClock: 3.5,
    boostClock: 4.4,
    tdp: 65,
    integratedGraphics: false,
    performanceScore: 72,
  },
  {
    id: 2,
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    image: "/cpu/7800x3d.png",
    price: 38999,
    socket: "AM5",
    cores: 8,
    threads: 16,
    baseClock: 4.2,
    boostClock: 5.0,
    tdp: 120,
    integratedGraphics: true,
    performanceScore: 98,
  },
];

export default cpus;
