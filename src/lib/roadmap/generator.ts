import { Brief, Channels, Roadmap30, RoadmapInputs, SnapPlan, TopicScore } from "./types";

function clean(value: string) {
  return (value || "").trim().replace(/\s+/g, " ");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function scoreTopic(title: string, intent: "Learn" | "Compare" | "Buy"): TopicScore {
  const lower = title.toLowerCase();
  let pipelineFit = intent === "Buy" ? 5 : intent === "Compare" ? 4 : 3;
  let authority = 3;
  let ease = 3;

  const boosts: Array<[string, number]> = [
    ["pricing", 2],
    ["calculator", 2],
    ["template", 2],
    ["checklist", 1],
    ["mistakes", 1],
    ["vs", 1],
    ["alternatives", 1],
  ];

  boosts.forEach(([keyword, bonus]) => {
    if (lower.includes(keyword)) {
      pipelineFit += bonus >= 2 ? 1 : 0;
      authority += 1;
      ease += keyword === "calculator" ? -1 : 0;
    }
  });

  pipelineFit = clamp(pipelineFit, 0, 5);
  authority = clamp(authority, 0, 5);
  ease = clamp(ease, 0, 5);
  return { pipelineFit, authority, ease, total: pipelineFit + authority + ease };
}

function pillarsFromOffer(description: string) {
  const lower = description.toLowerCase();
  if (lower.includes("saas") || lower.includes("software")) {
    return [
      { name: "Pain → Outcome", why: "Tie everything to the measurable result buyers want." },
      { name: "Proof + Benchmarks", why: "Teardowns, receipts, and mini case studies build trust." },
      { name: "Buying + Evaluation", why: "Comparisons, pricing, implementations remove friction." },
    ];
  }
  if (lower.includes("install") || lower.includes("local")) {
    return [
      { name: "Cost + Timelines", why: "People buy when they know exact price + schedule." },
      { name: "Trust + Proof", why: "Local buyers need receipts: photos, references, process." },
      { name: "Options + Tradeoffs", why: "Doubling conversions by showing choices + tradeoffs." },
    ];
  }
  return [
    { name: "Proof", why: "Receipts, real outcomes, and before/after." },
    { name: "Education", why: "Teach the belief that unlocks a purchase." },
    { name: "Conversion", why: "Answer objections and make next steps obvious." },
  ];
}

function buildHooks(inputs: RoadmapInputs): string[] {
  const product = clean(inputs.productName || "Your product");
  const icp = clean(inputs.icp);
  const diff = clean(inputs.differentiator);
  const outcome = diff || clean(inputs.offerDescription);

  return [
    `For ${icp}, ${product} is the fastest path to ${outcome}.`,
    `${product} vs the old way: why ${diff || "clarity and proof"} matters.`,
    `Buying guide: how ${icp} should evaluate ${product} (without getting fooled).`,
  ];
}

function buildPositioning(inputs: RoadmapInputs) {
  const product = clean(inputs.productName);
  const icp = clean(inputs.icp);
  const diff = clean(inputs.differentiator);
  const desc = clean(inputs.offerDescription);
  if (product && icp && diff) {
    return `${product} helps ${icp} ${diff}.`;
  }
  return `${product || "Your product"}: ${desc || "pipeline engine"}.`;
}

function titleBank(inputs: RoadmapInputs) {
  const name = clean(inputs.productName || "your product").split(" ").slice(0, 6).join(" ");
  const icp = clean(inputs.icp).split(" ").slice(0, 8).join(" ");

  return [
    { title: `${name} pricing, packages, and what to expect`, intent: "Buy" as const },
    { title: `${name} vs alternatives: what’s best for ${icp}?`, intent: "Compare" as const },
    { title: `Checklist: how ${icp} evaluate ${name} before buying`, intent: "Compare" as const },
    { title: `Common mistakes ${icp} make when choosing ${name}`, intent: "Learn" as const },
    { title: `${name} ROI calculator: know payback before you buy`, intent: "Buy" as const },
    { title: `Templates + scripts: launch ${name} faster`, intent: "Learn" as const },
    { title: `How to implement ${name} without chaos`, intent: "Learn" as const },
    { title: `Best ${name} comparisons for ${icp}`, intent: "Compare" as const },
    { title: `The honest guide to ${name}: costs, timelines, tradeoffs`, intent: "Buy" as const },
    { title: `${name} benchmarks and KPIs for ${icp}`, intent: "Learn" as const },
  ];
}

export function generateSnap(inputs: RoadmapInputs): SnapPlan {
  const positioning = buildPositioning(inputs);
  const hooks = buildHooks(inputs);
  const pillars = pillarsFromOffer(inputs.offerDescription);

  const next8 = titleBank(inputs)
    .map((entry) => {
      const why = entry.intent === "Buy"
        ? "Direct pipeline intent. Buyers need this to make a decision."
        : entry.intent === "Compare"
        ? "Evaluation content that converts when you prove the tradeoffs."
        : "Authority content that LLMs quote and prospects trust.";

      return {
        title: entry.title,
        why,
        score: scoreTopic(entry.title, entry.intent),
      };
    })
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 8);

  return { positioning, hooks, pillars, next8 };
}

function channelLabel(channels: Channels) {
  const list: string[] = [];
  if (channels.blog) list.push("Blog");
  if (channels.linkedin) list.push("LinkedIn");
  if (channels.youtube) list.push("YouTube");
  if (channels.email) list.push("Email");
  return list.length ? list.join(" + ") : "Blog";
}

export function generateBriefs(inputs: RoadmapInputs, snap: SnapPlan): Brief[] {
  return snap.next8.slice(0, 6).map((topic, idx) => {
    const title = topic.title;
    const lower = title.toLowerCase();
    const intent: "Learn" | "Compare" | "Buy" = lower.includes("pricing") || lower.includes("calculator")
      ? "Buy"
      : lower.includes("vs") || lower.includes("alternatives") || lower.includes("checklist")
      ? "Compare"
      : "Learn";

    const targetQuery = lower.replace(/[:]/g, "").trim();
    const bestAnswer = `If you’re ${clean(inputs.icp)}, the fastest way to decide on ${clean(inputs.productName)} is to compare total cost, time-to-value, and confirm ${clean(inputs.offerDescription)} actually produces results. This page gives the honest answer, comparisons, and next step.`;

    const outline = [
      "H2: The 10-second answer (who it's for, cost, result)",
      "H2: Decision checklist (requirements, red flags, must-haves)",
      "H2: Cost + timeline (what moves the number)",
      "H2: Proof (examples, before/after, benchmarks)",
      "H2: Comparisons (alternatives, tradeoffs)",
      "H2: Implementation or how-to", 
      "H2: FAQ / AI answer block",
      "H2: CTA (pipeline-focused)",
    ];

    const proof = [
      "Include 2 real examples with numbers (even anonymized).",
      "Add a comparison table with 3–5 alternatives.",
      "Include a 'mistakes' section with fixes.",
    ];

    const cta = intent === "Buy"
      ? "CTA: Request pricing / book a demo."
      : intent === "Compare"
      ? "CTA: Get a tailored recommendation call."
      : "CTA: Download the checklist / subscribe / request plan.";

    return {
      id: `brief_${idx}`,
      title,
      targetQuery,
      intent,
      bestAnswer,
      outline,
      proof,
      cta,
      score: topic.score,
    };
  });
}

export function generate30Day(inputs: RoadmapInputs, snap: SnapPlan): Roadmap30 {
  const cadence = inputs.cadence;
  const perWeek = cadence === "2/wk" ? 2 : cadence === "3/wk" ? 3 : 5;
  const channel = channelLabel(inputs.channels);
  const briefs = generateBriefs(inputs, snap);

  const weeks = [
    {
      week: 1,
      theme: "High-intent capture",
      deliverables: [
        "Publish pricing / cost page with CTA.",
        "Publish vs/alternatives teardown.",
        `Repurpose to ${channel}.`,
      ].slice(0, perWeek),
    },
    {
      week: 2,
      theme: "Decision frameworks",
      deliverables: [
        "Publish decision checklist page.",
        "Publish proof/case / before + after page.",
        `Repurpose to ${channel}.`,
      ].slice(0, perWeek),
    },
    {
      week: 3,
      theme: "Authority + AEO",
      deliverables: [
        "Publish mistakes page.",
        "Publish implementation guide.",
        `Repurpose to ${channel}.`,
      ].slice(0, perWeek),
    },
    {
      week: 4,
      theme: "Compounding",
      deliverables: [
        "Refresh two older pages with better answers.",
        "Add internal links + CTA blocks.",
        `Repurpose to ${channel}.`,
      ].slice(0, perWeek),
    },
  ];

  const quickWins = [
    { page: "/pricing", fix: "Add comparison table + objection section.", impact: "High" as const },
    { page: "/blog/guide", fix: "Add 10-second answer + FAQ block.", impact: "Medium" as const },
    { page: "/solutions", fix: "Add pipeline CTA with proof snippet.", impact: "High" as const },
  ];

  return { weeks, briefs, quickWins };
}
