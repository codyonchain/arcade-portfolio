export type Tone = "Direct" | "Premium" | "Playful";
export type Cadence = "2/wk" | "3/wk" | "5/wk";

export type Channels = {
  linkedin: boolean;
  youtube: boolean;
  email: boolean;
  blog: boolean;
};

export type RoadmapInputs = {
  domain: string;
  productName: string;
  offerDescription: string;
  icp: string;
  differentiator: string;
  tone: Tone;

  competitors: string[];
  cadence: Cadence;
  channels: Channels;
};

export type SnapPlan = {
  positioning: string;
  hooks: string[];
  pillars: Array<{ name: string; why: string }>;
  next8: Array<{ title: string; why: string; score: TopicScore }>;
};

export type TopicScore = {
  pipelineFit: number;
  authority: number;
  ease: number;
  total: number;
};

export type Brief = {
  id: string;
  title: string;
  targetQuery: string;
  intent: "Learn" | "Compare" | "Buy";
  bestAnswer: string;
  outline: string[];
  proof: string[];
  cta: string;
  score: TopicScore;
};

export type Roadmap30 = {
  weeks: Array<{
    week: number;
    theme: string;
    deliverables: string[];
  }>; 
  briefs: Brief[];
  quickWins: Array<{ page: string; fix: string; impact: "High" | "Medium" | "Low" }>;
};
