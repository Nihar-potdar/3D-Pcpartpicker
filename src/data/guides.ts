import {
  CircuitBoard,
  Cpu,
  HardDrive,
  Wrench,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type GuideSection = {
  title: string;
  body: string;
};

export type PcGuide = {
  slug: string;
  number: string;
  title: string;
  description: string;
  topics: string[];
  duration: string;
  level: string;
  icon: LucideIcon;
  detailIcon?: LucideIcon;
  featured?: boolean;
  image: string;
  imageAlt: string;
  imageCredit: string;
  imageSource: string;
  keyIdea: string;
  sections: GuideSection[];
  checklist: string[];
  warning: string;
};

export const guides: PcGuide[] = [
  {
    slug: "compatibility-first",
    number: "01",
    title: "Compatibility First",
    description:
      "Match the CPU socket, motherboard chipset, and memory generation before comparing performance.",
    topics: ["CPU sockets", "Chipsets", "DDR4 vs DDR5"],
    duration: "8 min",
    level: "Beginner",
    icon: Cpu,
    detailIcon: CircuitBoard,
    featured: true,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/LGA_775_CPU_Socket.jpg?width=1400",
    imageAlt: "Close-up photograph of a CPU socket on a motherboard",
    imageCredit: "Nayu Kim / CC BY 2.0",
    imageSource:
      "https://commons.wikimedia.org/wiki/File:LGA_775_CPU_Socket.jpg",
    keyIdea:
      "Start with the socket. A processor and motherboard must share the same socket before any other comparison matters.",
    sections: [
      {
        title: "Match the CPU socket",
        body: "Read the socket name on both product pages. Similar-looking CPUs from the same brand can still use different sockets, so match the exact name.",
      },
      {
        title: "Check chipset support",
        body: "A matching socket is only step one. Confirm that the motherboard chipset and BIOS version support the exact processor model you chose.",
      },
      {
        title: "Keep memory generations together",
        body: "A motherboard supports a specific RAM generation. DDR4 and DDR5 modules have different layouts and cannot be swapped into the same slot.",
      },
    ],
    checklist: [
      "CPU and motherboard socket names match",
      "CPU appears on the motherboard support list",
      "RAM generation matches the motherboard",
      "Case supports the motherboard size",
    ],
    warning:
      "Do not assume that matching brand names mean matching parts. Compare the exact model and specification every time.",
  },
  {
    slug: "power-without-guessing",
    number: "02",
    title: "Power Without Guessing",
    description:
      "Estimate system draw, understand PSU headroom, and avoid choosing wattage from GPU marketing alone.",
    topics: ["TDP", "Headroom", "Efficiency"],
    duration: "6 min",
    level: "Essential",
    icon: Zap,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/ATX_Computer_power_supply_unit.jpg?width=1400",
    imageAlt: "ATX computer power supply unit on a plain background",
    imageCredit: "Dmitry Makeev / CC BY-SA 4.0",
    imageSource:
      "https://commons.wikimedia.org/wiki/File:ATX_Computer_power_supply_unit.jpg",
    keyIdea:
      "Choose a quality PSU with sensible headroom, not the largest wattage number you can afford.",
    sections: [
      {
        title: "Estimate the full system",
        body: "Count the CPU and GPU first, then include the motherboard, fans, storage, and accessories. Your build uses power as one system.",
      },
      {
        title: "Leave practical headroom",
        body: "A PSU should not sit at its limit during normal use. Extra capacity helps with short power spikes, quieter fan operation, and future upgrades.",
      },
      {
        title: "Verify the connectors",
        body: "Check the motherboard, CPU, and GPU power connectors. Enough wattage is useless if the PSU does not have the plugs your parts require.",
      },
    ],
    checklist: [
      "Estimated load stays below PSU capacity",
      "CPU and GPU power connectors are available",
      "PSU physically fits the case",
      "Model has trustworthy independent reviews",
    ],
    warning:
      "Never open a power supply. Internal components can retain dangerous electrical charge even after it is unplugged.",
  },
  {
    slug: "airflow-that-makes-sense",
    number: "03",
    title: "Airflow That Makes Sense",
    description:
      "Plan intake, exhaust, cooler height, and fan placement so the finished build can breathe.",
    topics: ["Fan direction", "Pressure", "Clearance"],
    duration: "7 min",
    level: "Beginner",
    icon: Wind,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Fan_and_case.jpg?width=1400",
    imageAlt: "Computer case interior showing a rear cooling fan",
    imageCredit: "Truong Manh An / CC BY-SA 3.0",
    imageSource: "https://commons.wikimedia.org/wiki/File:Fan_and_case.jpg",
    keyIdea:
      "Give cool air a clear path in and warm air a clear path out. More fans are not automatically better.",
    sections: [
      {
        title: "Create a simple direction",
        body: "Front and bottom fans usually bring cool air in. Rear and top fans usually move warm air out. Keep the path easy to understand.",
      },
      {
        title: "Check every clearance",
        body: "Compare CPU-cooler height, radiator space, GPU length, and RAM clearance with the limits listed by the case manufacturer.",
      },
      {
        title: "Keep the path open",
        body: "Route cables away from fans and major air paths. Clean dust filters regularly instead of trying to solve dust with extreme fan speed.",
      },
    ],
    checklist: [
      "At least one intake and one exhaust path",
      "Fan arrows face the intended direction",
      "Cooler and GPU fit the case limits",
      "No loose cable can reach a fan blade",
    ],
    warning:
      "Do not install every fan as exhaust. With no deliberate intake, the case pulls dusty air through unfiltered gaps.",
  },
  {
    slug: "storage-without-confusion",
    number: "04",
    title: "Storage Without Confusion",
    description:
      "Separate physical connectors from storage protocols and choose the right drive for each job.",
    topics: ["M.2", "NVMe", "SATA"],
    duration: "5 min",
    level: "Beginner",
    icon: HardDrive,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Samsung_NVMe_M.2_970_EVO_Plus_18540.jpg?width=1400",
    imageAlt: "Samsung NVMe M.2 SSD installed on a motherboard",
    imageCredit: "Michael Wolf / CC BY-SA 3.0",
    imageSource:
      "https://commons.wikimedia.org/wiki/File:Samsung_NVMe_M.2_970_EVO_Plus_18540.jpg",
    keyIdea:
      "M.2 describes the physical shape and connector. NVMe and SATA describe how a storage drive communicates.",
    sections: [
      {
        title: "Separate shape from protocol",
        body: "Two drives can both be M.2 while using different protocols. Read the drive and motherboard specifications instead of judging by appearance.",
      },
      {
        title: "Check the slot notes",
        body: "Motherboard manuals explain which M.2 lengths and protocols each slot supports. They also mention when a slot shares bandwidth with another port.",
      },
      {
        title: "Choose storage by job",
        body: "Use a fast SSD for the operating system and active applications. Larger, slower storage can still make sense for archives and media.",
      },
    ],
    checklist: [
      "Drive protocol is supported by the chosen slot",
      "M.2 length fits the mounting position",
      "Enough total capacity remains after the OS",
      "Shared-port limitations are understood",
    ],
    warning:
      "An M.2 drive fitting into a slot does not guarantee that its SATA or NVMe protocol is supported there.",
  },
  {
    slug: "first-build-sequence",
    number: "05",
    title: "Your First Build Sequence",
    description:
      "Follow a practical assembly order, perform a safe first boot, and diagnose the most common mistakes.",
    topics: ["Assembly", "POST", "Troubleshooting"],
    duration: "10 min",
    level: "Practical",
    icon: Wrench,
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Assemble_a_Desktop_PC_-_Jan._2013.jpg?width=1400",
    imageAlt: "Desktop PC components arranged during a computer build",
    imageCredit: "Dave Dugdale / CC BY-SA 2.0",
    imageSource:
      "https://commons.wikimedia.org/wiki/File:Assemble_a_Desktop_PC_-_Jan._2013.jpg",
    keyIdea:
      "Build in small, testable stages. It is easier to find one mistake before every panel and cable is installed.",
    sections: [
      {
        title: "Prepare outside the case",
        body: "Install the CPU, cooler, RAM, and primary M.2 drive on the motherboard first. Work on a clean table and follow the manuals.",
      },
      {
        title: "Mount and connect",
        body: "Install the correct standoffs, lower in the motherboard, add the PSU and GPU, then connect power, cooling, storage, and front-panel cables.",
      },
      {
        title: "Test before tidying",
        body: "Perform the first boot before closing the case. Confirm that the system reaches its setup screen, detects memory and storage, and reports sensible temperatures.",
      },
    ],
    checklist: [
      "Power is disconnected while installing parts",
      "Motherboard standoffs match its mounting holes",
      "CPU, motherboard, and GPU power are connected",
      "Display cable is connected to the correct output",
    ],
    warning:
      "Never force a component into place. Stop and recheck its orientation, latch, and manual when normal pressure is not enough.",
  },
];
