import type { CompatibleComponent } from "@/data/type";

export type PartHighlight = {
  label: string;
  value: string;
};

export function getPartHighlights(
  part: CompatibleComponent,
): PartHighlight[] {
  switch (part.componentType) {
   case "CPU":
  return [
    {
      label: "Socket",
      value: `${part.socket} SOCKET`,
    },
    {
      label: "Cores",
      value: `${part.cores}C / ${part.threads}T`,
    },
    {
      label: "Boost",
      value: `${part.boostClock} GHz BOOST`,
    },
    {
      label: "TDP",
      value: `${part.tdp}W TDP`,
    },
  ];

    case "GPU":
  return [
    {
      label: "VRAM",
      value: `${part.vram}GB VRAM`,
    },
    {
      label: "Chipset",
      value: part.chipset,
    },
    {
      label: "Power",
      value: `${part.tdp}W TDP`,
    },
    {
      label: "Length",
      value: `${part.length}mm`,
    },
  ];

    case "RAM":
  return [
    {
      label: "Memory type",
      value: part.type,
    },
    {
      label: "Speed",
      value: `${part.speed} MT/s`,
    },
    {
      label: "Latency",
      value: `CL${part.casLatency}`,
    },
    {
      label: "Capacity",
      value: `${part.capacity}GB · ${part.modules}`,
    },
  ];

    case "Motherboard":
      return [
        {
          label: "Socket",
          value: part.socket,
        },
        {
          label: "Memory",
          value: part.ramType,
        },
        {
          label: "Size",
          value: part.formFactor,
        },
        {
          label: "M.2",
          value: `${part.m2Slots} slots`,
        },
      ];

    case "PSU":
      return [
        {
          label: "Power",
          value: `${part.wattage}W`,
        },
        {
          label: "Efficiency",
          value: part.efficiencyRating,
        },
        {
          label: "Modularity",
          value: part.modularity,
        },
      ];

    case "Storage":
      return [
        {
          label: "Capacity",
          value:
            part.capacityGB >= 1000
              ? `${part.capacityGB / 1000}TB`
              : `${part.capacityGB}GB`,
        },
        {
          label: "Protocol",
          value: part.protocol,
        },
        {
          label: "Connector",
          value: part.connector,
        },
        {
          label: "Read speed",
          value: `${part.readSpeedMBps} MB/s`,
        },
      ];

    case "Case":
      return [
        {
          label: "Size",
          value: part.formFactor,
        },
        {
          label: "Max GPU",
          value: `${part.maxGpuLength}mm`,
        },
        {
          label: "Glass",
          value: part.temperedGlass ? "Tempered glass" : "Solid panel",
        },
      ];
  }
}