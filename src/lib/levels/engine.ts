import { Aura, LevelClass, Quest, QuestType, RunState } from "./types";

export function levelThreshold(level: number) {
  return 100 + (level - 1) * 60;
}

export function auraFromXpToday(xpToday: number): Aura {
  if (xpToday >= 220) return "Radiant";
  if (xpToday >= 140) return "Charged";
  if (xpToday >= 60) return "Glowing";
  return "Dormant";
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

const QUEST_XP_RANGES: Record<QuestType, [number, number]> = {
  quick: [35, 55],
  build: [60, 90],
  boss: [110, 160],
};

export function xpForQuestType(type: QuestType, seed = 0) {
  const [min, max] = QUEST_XP_RANGES[type];
  const span = max - min + 1;
  const mix = Math.abs(Math.floor(seed * 13.37) + type.charCodeAt(0) * 17 + type.length * 5);
  const value = min + (mix % span);
  return clamp(value, min, max);
}

function uniqueId(prefix: string) {
  const rnd = Math.random().toString(36).slice(2, 7);
  return `${prefix}_${Date.now().toString(36)}_${rnd}`;
}

export function buildCustomQuest(title: string, type: QuestType, seed: number): Quest {
  const name = title.trim() || "Custom Quest";
  return {
    id: uniqueId("custom"),
    type,
    title: name,
    desc: `Custom quest: ${name}`,
    xp: xpForQuestType(type, seed + name.length),
  };
}

export function generateQuests(goal: string): Quest[] {
  const g = (goal || "Level up today").trim().replace(/\.$/, "");
  const seed = g.length || 1;

  return [
    { id: "q_quick", type: "quick", title: `Quick Quest`, desc: `Do a 15-minute version of: ${g}`, xp: xpForQuestType("quick", seed + 3) },
    { id: "q_build", type: "build", title: `Build Quest`, desc: `Make real progress on: ${g} (30–60 min)`, xp: xpForQuestType("build", seed + 9) },
    { id: "q_boss", type: "boss", title: `Boss Fight`, desc: `Push the needle hard on: ${g} (90 min)`, xp: xpForQuestType("boss", seed + 21) },
  ];
}

export function applyPerk(cls: LevelClass, questType: QuestType, baseXp: number): { xp: number; perkNote?: string } {
  if (cls.perkRule === "quick_bonus" && questType === "quick") {
    const bonus = Math.round(baseXp * 0.1);
    return { xp: baseXp + bonus, perkNote: `Perk triggered: +${bonus} XP` };
  }
  if (cls.perkRule === "build_bonus" && questType === "build") {
    const bonus = 15;
    return { xp: baseXp + bonus, perkNote: `Perk triggered: +${bonus} XP` };
  }
  if (cls.perkRule === "boss_bonus" && questType === "boss") {
    const bonus = Math.round(baseXp * 0.1);
    return { xp: baseXp + bonus, perkNote: `Perk triggered: +${bonus} XP` };
  }
  return { xp: baseXp };
}

export function awardXp(state: RunState, xpGain: number) {
  let xp = state.xp + xpGain;
  let level = state.level;

  while (xp >= levelThreshold(level)) {
    xp -= levelThreshold(level);
    level += 1;
  }

  return { xp, level };
}

export function recapMoment(state: RunState, className: string) {
  const completedCount = Object.values(state.completed).filter(Boolean).length;
  const inputs = [
    `${className} carved a path with ${completedCount} quests.`,
    `${className} earned ${state.xpEarnedThisRun} XP inside Aura Grove.`,
    `${className} pushed the streak to ${state.streak}.`,
    `${className} leveled up to ${state.level}.`,
  ];
  const base = state.xpEarnedThisRun + completedCount * 17 + state.streak * 31 + className.length * 7;
  const pick = clamp(base % inputs.length, 0, inputs.length - 1);
  return inputs[pick];
}
