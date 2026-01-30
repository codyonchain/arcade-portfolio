import { RoadmapInputs } from "./types";

export const ROADMAP_EXAMPLES: Array<{ label: string; values: Partial<RoadmapInputs> }> = [
  {
    label: "B2B SaaS for dental practices",
    values: {
      domain: "dentflow.com",
      productName: "DentFlow",
      offerDescription: "B2B SaaS that automates patient recall + scheduling for dental practices",
      icp: "dental practice owners and office managers at 2–15 chair practices",
      differentiator: "we turn no-shows into booked revenue with a simple, measurable system",
      tone: "Premium",
      competitors: ["nexhealth.com", "solutionreach.com", "weave.com"],
      cadence: "3/wk",
      channels: { linkedin: true, youtube: false, email: true, blog: true },
    },
  },
  {
    label: "AI assistant for contractors",
    values: {
      domain: "sitegenius.ai",
      productName: "SiteGenius",
      offerDescription: "AI assistant that generates scopes, estimates, and client-ready summaries for contractors",
      icp: "commercial contractors and estimators at $5M–$50M/yr firms",
      differentiator: "deterministic outputs + explainable assumptions (not vibes)",
      tone: "Direct",
      competitors: ["procore.com", "buildertrend.com", "stackct.com"],
      cadence: "2/wk",
      channels: { linkedin: true, youtube: true, email: false, blog: true },
    },
  },
  {
    label: "Local service (high-ticket installs)",
    values: {
      domain: "dinkordunk.com",
      productName: "Dink or Dunk",
      offerDescription: "High-end backyard sports courts (pickleball/basketball) installed turnkey",
      icp: "homeowners in affluent suburbs who want a premium backyard upgrade",
      differentiator: "white-glove install + design mockups + fast scheduling",
      tone: "Playful",
      competitors: ["sportcourt.com", "backyardsports.com", "localinstallers.com"],
      cadence: "5/wk",
      channels: { linkedin: false, youtube: true, email: true, blog: true },
    },
  },
];

export const DEFAULT_INPUTS: RoadmapInputs = {
  domain: "",
  productName: "",
  offerDescription: "",
  icp: "",
  differentiator: "",
  tone: "Direct",
  competitors: [],
  cadence: "3/wk",
  channels: { linkedin: true, youtube: false, email: true, blog: true },
};
