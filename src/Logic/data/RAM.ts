import type { RAM } from "@/Logic/data/type.ts";


export const ram: RAM[] = [
  {
    id: 1,
    name: "Corsair Vengeance RGB",
    brand: "Corsair",
    image: "/ram/corsair-rgb.png",
    price: 8499,
    type: "DDR5",
    capacity: 32,
    speed: 6000,
    modules: "2x16GB",
    rgb: true,
  },
  {
    id: 2,
    name: "Kingston Fury Beast",
    brand: "Kingston",
    image: "/ram/fury-beast.png",
    price: 4899,
    type: "DDR4",
    capacity: 16,
    speed: 3200,
    modules: "2x8GB",
    rgb: false,
  },
];
