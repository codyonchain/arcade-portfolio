import { LevelClass } from "./types";

export const LEVEL_CLASSES: LevelClass[] = [
  { id: "monk", name: "Monk of Momentum", power: "Streaks become inevitable.", perk: "+10% XP on Quick Quests.", weakness: "Falls off when mornings slip.", perkRule: "quick_bonus" },
  { id: "chaos", name: "Chaos Mage", power: "Turns chaos into progress.", perk: "+10% XP on Boss Fights.", weakness: "Overcommits to side quests.", perkRule: "boss_bonus" },
  { id: "builder", name: "Builder", power: "Ships daily, no excuses.", perk: "+15 XP on Build Quests.", weakness: "Forgets recovery.", perkRule: "build_bonus" },
  { id: "ranger", name: "Focus Ranger", power: "Snipes the highest impact.", perk: "+10% XP on Build Quests.", weakness: "Hates interruptions.", perkRule: "build_bonus" },
  { id: "paladin", name: "Paladin of Discipline", power: "Consistency is your weapon.", perk: "+1 streak bonus when you start strong.", weakness: "Rigid when plans change.", perkRule: "streak_bonus" },
  { id: "alchemist", name: "Habit Alchemist", power: "Small actions compound.", perk: "+10% XP on Quick Quests.", weakness: "Over-optimizes the system.", perkRule: "quick_bonus" },
  { id: "assassin", name: "Distraction Assassin", power: "Deletes distractions.", perk: "+15 XP on Quick Quests.", weakness: "Relapses after ‘one check’.", perkRule: "quick_bonus" },
  { id: "captain", name: "Captain of Clarity", power: "Always knows the next move.", perk: "+10% XP on Boss Fights.", weakness: "Can over-plan.", perkRule: "boss_bonus" },
];
