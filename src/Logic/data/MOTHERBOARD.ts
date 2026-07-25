import type { Motherboard } from "@/Logic/data/type"

export const motherboards: Motherboard[] = [
  {
    id: 1,
    name: "MSI B650 Tomahawk WiFi",
    brand: "MSI",
    image: "/motherboard/b650-tomahawk.png",
    price: 22999,
    socket: "AM5",
    chipset: "B650",
    formFactor: "ATX",
    ramType: "DDR5",
    wifi: true,
  },
  {
    id: 2,
    name: "ASUS Prime B760 Plus",
    brand: "ASUS",
    image: "/motherboard/b760-plus.png",
    price: 15999,
    socket: "LGA1700",
    chipset: "B760",
    formFactor: "ATX",
    ramType: "DDR5",
    wifi: false,
  },
];
