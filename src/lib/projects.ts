export type ProjectId = "specsharp" | "levels" | "roadmap" | "flipcalc";

export type DockField = {
  key: string;
  label: string;
  placeholder: string;
};

export type Project = {
  id: ProjectId;
  title: string;
  tagline: string;
  micro: string;
  cta: string;
  hint: string;
  route: string;
  external?: boolean;
  examples: string[];
  inputLabel: string;
  runLabel: string;
  accent: string;
  accent2: string;
  bg1: string;
  bg2: string;
  worldName: string;
  dockFields?: DockField[];
};

export const PROJECTS: Project[] = [
  {
    id: "specsharp",
    title: "SpecSharp",
    tagline: "Construction intelligence that feels unfair.",
    micro: "Turns messy bids into decision-grade clarity — risk, scope, and cost signals.",
    cta: "OPEN (NEW TAB)",
    hint: "Enter",
    route: "https://specsharp.ai",
    external: true,
    examples: [
      "120,000 SF distribution warehouse in Dallas, TX",
      "8,000 SF primary care clinic in Nashville, TN",
      "40,000 SF restaurant + retail mixed-use shell"
    ],
    inputLabel: "Describe a building or paste a scope snippet",
    runLabel: "Generate scope preview",
    accent: "#7AB2FF",
    accent2: "#62FFE3",
    bg1: "#0B1020",
    bg2: "#102B4D",
    worldName: "ICE DOCKS"
  },
  {
    id: "levels",
    title: "Levels.app",
    tagline: "Habits, as an RPG you actually want to play.",
    micro: "Choose a character → quests → XP → level up → recap card.",
    cta: "CHOOSE CHARACTER",
    hint: "Enter",
    route: "/levels",
    examples: [
      "Stop doomscrolling after 9pm",
      "Gym 4x/week",
      "Ship one feature every day"
    ],
    inputLabel: "Class + goal fuel your quests",
    runLabel: "Generate Quests",
    accent: "#C07CFF",
    accent2: "#FF4FD8",
    bg1: "#140A22",
    bg2: "#2B0F55",
    worldName: "AURA GROVE",
    dockFields: [
      { key: "className", label: "Class Name", placeholder: "Monk of Momentum" },
      { key: "goal", label: "Goal", placeholder: "Ship one feature/day" }
    ]
  },
  {
    id: "roadmap",
    title: "The Roadmap",
    tagline: "Search Presence Roadmap (SEO + AEO) → pipeline.",
    micro: "Snap Plan in seconds. Underwrite in minutes. Briefs + Packet.",
    cta: "PRESS START",
    hint: "Enter",
    route: "/roadmap",
    examples: [
      "SpecSharp / underwriting for contractors",
      "B2B SaaS for dental practices",
      "Local sports court installs"
    ],
    inputLabel: "Product + offer + ICP + differentiator",
    runLabel: "Generate Snap Plan",
    accent: "#A6FF4D",
    accent2: "#4DFFD5",
    bg1: "#081B12",
    bg2: "#143B1D",
    worldName: "GROWTH GRID",
    dockFields: [
      { key: "productName", label: "Product Name", placeholder: "SpecSharp" },
      { key: "offerDesc", label: "Offer Snapshot", placeholder: "Underwriting autopilot packet" },
      { key: "icp", label: "ICP", placeholder: "Mid-market contractors" },
      { key: "differentiator", label: "Differentiator", placeholder: "turns messy bids into clear go/no-go" }
    ]
  },
  {
    id: "flipcalc",
    title: "FlipCalc",
    tagline: "Deal underwriting that doesn’t waste your time.",
    micro: "Address → Prefill → ARV range → Verdict + Max Offer → Packet.",
    cta: "RUN NUMBERS",
    hint: "Enter",
    route: "/flipcalc",
    examples: [
      "114 Maple St, Nashville, TN 37209",
      "22 Brookside Dr, Franklin, TN 37064",
      "808 Pine Hollow Ct, Chattanooga, TN 37405"
    ],
    inputLabel: "Start typing or pick an example address",
    runLabel: "Run Snap Verdict",
    accent: "#FFB84D",
    accent2: "#FF5E8A",
    bg1: "#1B1208",
    bg2: "#4A2C10",
    worldName: "COIN CASTLE"
  }
];
