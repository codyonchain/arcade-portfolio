export type LevelClass = {
  id: string;
  name: string;
  power: string;
  perk: string;
  weakness: string;
  perkRule: "quick_bonus" | "build_bonus" | "boss_bonus" | "streak_bonus";
};

export type QuestType = "quick" | "build" | "boss";

export type Quest = {
  id: string;
  type: QuestType;
  title: string;
  desc: string;
  xp: number;
};

export type Aura = "Dormant" | "Glowing" | "Charged" | "Radiant";

export type RunState = {
  started: boolean;
  goal: string;
  classId: string | null;

  level: number;
  xp: number;
  streak: number;

  completed: Record<string, boolean>;
  awardedStreakToday: boolean;
  customQuests: Quest[];
  xpEarnedThisRun: number;
};
