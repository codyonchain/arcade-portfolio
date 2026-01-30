import { ProjectId } from "./projects";
import { MOCK_PROPERTIES } from "./flipcalc/mockData";
import { buildDefaultInputs, computeVerdict, money, pct } from "./flipcalc/calc";
import { LEVEL_CLASSES } from "./levels/classes";
import { applyPerk, auraFromXpToday, generateQuests } from "./levels/engine";

export type RoadmapDockInput = {
  productName: string;
  offerDesc: string;
  icp: string;
  differentiator: string;
};

export type LevelsDockInput = {
  className: string;
  goal: string;
};

export type TryNowInput = string | RoadmapDockInput | LevelsDockInput;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isRoadmapInput(input: TryNowInput): input is RoadmapDockInput {
  return typeof input === "object" && !!input && "productName" in input && "offerDesc" in input && "icp" in input && "differentiator" in input;
}

function isLevelsInput(input: TryNowInput): input is LevelsDockInput {
  return typeof input === "object" && !!input && "className" in input && "goal" in input;
}

export function runTryNow(projectId: ProjectId, input: TryNowInput) {
  if (projectId === "roadmap") {
    if (!isRoadmapInput(input)) {
      return { title: "Roadmap Preview", blocks: [{ label: "Tip", value: "Fill in product, offer, ICP, differentiator." }] };
    }
    const { productName, offerDesc, icp, differentiator } = input;
    if (![productName, offerDesc, icp, differentiator].every((field) => field.trim().length > 0)) {
      return { title: "Roadmap Preview", blocks: [{ label: "Tip", value: "All fields feed your Snap Plan. Fill them in." }] };
    }

    const positioning = `${productName} helps ${icp} ${differentiator}.`;
    const hooks = [
      `${icp} finally see how to ${differentiator} (without random content).`,
      `${offerDesc} packaged into search demand that compounds weekly.`,
      `Proof + education + offers mapped so ${icp} move into pipeline.`
    ];
    const nextPieces = [
      `Snap Plan: ${productName} search spine`,
      `Brief: ${icp} proof stack`,
      `Packet: ${differentiator}`
    ];

    return {
      title: "Roadmap Preview",
      blocks: [
        { label: "Positioning", value: positioning },
        { label: "Hooks", value: hooks.map((h) => `• ${h}`).join("\n") },
        { label: "Next 3 Pieces", value: nextPieces.map((p) => `• ${p}`).join("\n") }
      ]
    };
  }

  if (projectId === "flipcalc") {
    const trimmed = typeof input === "string" ? input.trim() : "";
    if (!trimmed) {
      return { title: "Snap Verdict", blocks: [{ label: "Tip", value: "Enter an address or tap an example." }] };
    }
    const property = MOCK_PROPERTIES.find(
      (p) => `${p.address}, ${p.cityState}`.toLowerCase() === trimmed.toLowerCase()
    );
    if (!property) {
      return { title: "Snap Verdict", blocks: [{ label: "Not Found", value: "Pick an example address to mirror the FlipCalc experience." }] };
    }
    const inputs = buildDefaultInputs(property);
    const verdict = computeVerdict(inputs);

    return {
      title: "Snap Verdict",
      blocks: [
        {
          label: "ARV + Rehab",
          value: `${money(property.arvMin)} – ${money(property.arvMax)} • Rehab ${money(verdict.rehabTotal)}`
        },
        {
          label: "Verdict",
          value: `${verdict.verdictLabel} (${pct(clamp(verdict.roi, -1, 2))} ROI)`
        },
        { label: "Max Offer", value: money(verdict.maxOffer) }
      ]
    };
  }

  if (projectId === "levels") {
    if (!isLevelsInput(input)) {
      return { title: "Quest Preview", blocks: [{ label: "Tip", value: "Pick a class + set a goal to see quests." }] };
    }
    if (!input.goal.trim()) {
      return { title: "Quest Preview", blocks: [{ label: "Tip", value: "Set a goal to generate quests." }] };
    }
    const cls =
      LEVEL_CLASSES.find((c) => c.name.toLowerCase() === input.className.trim().toLowerCase()) ?? LEVEL_CLASSES[0];
    const quests = generateQuests(input.goal).map((quest) => {
      if (cls) {
        const perked = applyPerk(cls, quest.type, quest.xp);
        return { ...quest, xp: perked.xp };
      }
      return quest;
    });
    const totalXp = quests.reduce((sum, quest) => sum + quest.xp, 0);
    const aura = auraFromXpToday(totalXp);

    return {
      title: "Quest Preview",
      blocks: [
        {
          label: "Quests",
          value: quests.map((quest) => `• ${quest.title}: +${quest.xp} XP`).join("\n")
        },
        { label: "XP Total", value: `${totalXp} XP • Aura Preview: ${aura}` }
      ]
    };
  }

  const trimmed = typeof input === "string" ? input.trim() : "";
  if (!trimmed) {
    return { title: "Scope Preview", blocks: [{ label: "Tip", value: "Describe the project or tap an example chip." }] };
  }

  return {
    title: "Scope Preview",
    blocks: [
      {
        label: "Signals",
        value: `• Input: ${trimmed}\n• Core scope buckets mapped\n• Risk flags + cost drivers surfaced`
      },
      {
        label: "Questions",
        value: "• Confirm use case / occupancy\n• Target delivery + phasing\n• Finish level + specialty systems"
      }
    ]
  };
}
