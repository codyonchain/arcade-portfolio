"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LevelsWorldShell from "@/components/levels/LevelsWorldShell";
import CharacterSelect from "@/components/levels/CharacterSelect";
import QuestBoard from "@/components/levels/QuestBoard";
import LevelUpModal from "@/components/levels/LevelUpModal";
import WorldFeed from "@/components/levels/WorldFeed";
import CharacterAvatar from "@/components/levels/CharacterAvatar";
import RecapCard from "@/components/levels/RecapCard";
import NeonButton from "@/components/NeonButton";
import ExampleChips from "@/components/ExampleChips";
import { LEVEL_CLASSES } from "@/lib/levels/classes";
import { applyPerk, auraFromXpToday, awardXp, buildCustomQuest, generateQuests, levelThreshold, recapMoment } from "@/lib/levels/engine";
import { Quest, QuestType, RunState } from "@/lib/levels/types";

type StatTone = "default" | "warn" | "good";

function StatBadge({ label, value, tone = "default" }: { label: string; value: string; tone?: StatTone }) {
  const toneClass =
    tone === "good"
      ? "bg-emerald-500/20 text-emerald-100"
      : tone === "warn"
        ? "bg-amber-500/20 text-amber-200"
        : "bg-white/10 text-white/80";
  return (
    <div className="text-right">
      <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">{label}</div>
      <div className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${toneClass}`}>
        {value}
      </div>
    </div>
  );
}

const GOAL_EXAMPLES = ["Ship one feature/day", "Gym 4x/week", "Stop doomscrolling after 9pm"];

const LS_KEY = "levels_run_state_v1";

const createDefaultState = (): RunState => ({
  started: false,
  goal: GOAL_EXAMPLES[0],
  classId: null,
  level: 1,
  xp: 0,
  streak: 0,
  completed: {},
  awardedStreakToday: false,
  customQuests: [],
  xpEarnedThisRun: 0,
});

function loadState(): RunState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...createDefaultState(),
      ...parsed,
      customQuests: parsed.customQuests ?? [],
      xpEarnedThisRun: parsed.xpEarnedThisRun ?? 0,
    };
  } catch {
    return null;
  }
}
function saveState(s: RunState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {}
}

export default function LevelsPage() {
  const [state, setState] = useState<RunState>(() => createDefaultState());

  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [perkToast, setPerkToast] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customType, setCustomType] = useState<QuestType>("quick");

  useEffect(() => {
    const s = loadState();
    if (s) setState(s);
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const cls = useMemo(() => LEVEL_CLASSES.find((c) => c.id === state.classId) || null, [state.classId]);
  const generatedQuests = useMemo(() => generateQuests(state.goal), [state.goal]);

  const aura = auraFromXpToday(state.xpEarnedThisRun);
  const totalQuests = generatedQuests.length + state.customQuests.length;
  const questsCompleted = Object.values(state.completed).filter(Boolean).length;
  const momentLine = recapMoment(state, cls?.name ?? "Runner");
  const hudStickyTop = "calc(env(safe-area-inset-top) + 82px)";

  const completeQuest = (quest: Quest) => {
    if (!cls) return;
    if (state.completed[quest.id]) return;

    const perk = applyPerk(cls, quest.type, quest.xp);
    if (perk.perkNote) {
      setPerkToast(perk.perkNote);
      setTimeout(() => setPerkToast(null), 1200);
    }

    const beforeLevel = state.level;
    const nextProgress = awardXp(state, perk.xp);

    const firstQuestThisSession = !state.awardedStreakToday;
    const streakBonus = firstQuestThisSession && cls.perkRule === "streak_bonus" ? 1 : 0;

    const next: RunState = {
      ...state,
      xp: nextProgress.xp,
      level: nextProgress.level,
      completed: { ...state.completed, [quest.id]: true },
      streak: firstQuestThisSession ? state.streak + 1 + streakBonus : state.streak,
      awardedStreakToday: true,
      xpEarnedThisRun: state.xpEarnedThisRun + perk.xp,
    };

    setState(next);

    if (nextProgress.level > beforeLevel) {
      setNewLevel(nextProgress.level);
      setLevelUpOpen(true);
    }
  };

  const reset = () => {
    setState((s) => ({
      ...createDefaultState(),
      customQuests: s.customQuests,
    }));
  };

  const startRun = () => {
    if (!state.classId) return;
    setState((s) => ({
      ...s,
      started: true,
      completed: {},
      xp: 0,
      level: 1,
      xpEarnedThisRun: 0,
      awardedStreakToday: false,
    }));
  };

  const handleAddCustomQuest = () => {
    const title = customTitle.trim();
    if (!title) return;
    setState((s) => {
      const newQuest = buildCustomQuest(title, customType, s.goal.length + s.customQuests.length + 1);
      return { ...s, customQuests: [...s.customQuests, newQuest] };
    });
    setCustomTitle("");
  };

  const handleRemoveCustomQuest = (id: string) => {
    setState((s) => {
      const nextCustom = s.customQuests.filter((q) => q.id !== id);
      const nextCompleted = { ...s.completed };
      delete nextCompleted[id];
      return { ...s, customQuests: nextCustom, completed: nextCompleted };
    });
  };

  const progressPct = Math.min(100, (state.xp / levelThreshold(state.level)) * 100);
  const canAddQuest = customTitle.trim().length > 0;

  return (
    <LevelsWorldShell>
      <section className="pt-2">
        <div className="max-w-4xl">
          <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">
            WORLD 02 • AURA GROVE
          </div>
          <h1 className="crt-text mt-3 text-5xl font-semibold tracking-tight md:text-6xl">
            Choose your character. Start a run.
          </h1>
          <p className="mt-3 text-sm text-white/70 md:text-base">
            Gain XP from quests. Level up. Build streak aura. Make progress feel like a game.
          </p>
        </div>
        <div className="mt-6 h-px w-full bg-white/10" />
      </section>

      <AnimatePresence mode="wait">
        {!state.started ? (
          <motion.section
            key="select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <CharacterSelect
              classes={LEVEL_CLASSES}
              selectedId={state.classId}
              onSelect={(id) => setState((s) => ({ ...s, classId: id }))}
            />

            <div className="plastic glow-border p-6">
              <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">START RUN</div>
              <div className="mt-2 text-xl font-semibold tracking-tight crt-text">
                {cls ? cls.name : "Select a class"}
              </div>
              <div className="mt-1 text-sm text-white/70">Pick a goal. Generate quests. Press start.</div>

              <div className="mt-6 space-y-4">
                <ExampleChips items={GOAL_EXAMPLES} value={state.goal} onChange={(v) => setState((s) => ({ ...s, goal: v }))} label="Goal Examples" />
                <input
                  value={state.goal}
                  onChange={(e) => setState((s) => ({ ...s, goal: e.target.value }))}
                  className="focus-ring w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white/90 placeholder:text-white/35"
                />

                <NeonButton
                  variant="primary"
                  onClick={startRun}
                  className="w-full justify-center"
                  ariaLabel="Start Run"
                >
                  {cls ? "PRESS START" : "CHOOSE A CHARACTER FIRST"}
                </NeonButton>

                <div className="text-xs text-white/45">
                  Tip: This is the portfolio “world.” The full app adds classes evolving over weeks + cinematic recap.
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="play"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="space-y-6">
              <div className="sticky z-30 md:static" style={{ top: hudStickyTop }}>
                <div className="plastic glow-border p-6 backdrop-blur-md md:backdrop-blur-0">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <CharacterAvatar classId={cls?.id ?? null} />
                      <div>
                        <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">RUN HUD</div>
                      <div className="mt-2 text-xl font-semibold tracking-tight crt-text">{cls?.name ?? "Runner"}</div>
                      <div className="mt-1 text-sm text-white/70">{state.goal}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-start justify-end gap-4">
                    <StatBadge label="Level" value={`${state.level}`} />
                    <StatBadge label="Streak" value={`${state.streak}`} tone={state.streak >= 7 ? "good" : "default"} />
                    <StatBadge
                      label="Aura"
                      value={aura}
                      tone={aura === "Radiant" ? "good" : aura === "Charged" ? "warn" : "default"}
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between text-sm text-white/75">
                    <span>XP</span>
                    <span className="text-white/90 font-semibold">
                      {state.xp} / {levelThreshold(state.level)}
                    </span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full border border-white/10 bg-black/40">
                    <motion.div
                      className="h-full bg-white/20"
                      animate={{ width: `${progressPct}%` }}
                      transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <NeonButton variant="ghost" onClick={() => setState((s) => ({ ...s, started: false }))} className="w-full justify-center text-xs sm:w-auto">
                    EXIT TO MENU
                  </NeonButton>
                  <NeonButton variant="ghost" onClick={reset} className="w-full justify-center text-xs sm:w-auto">
                    RESET
                  </NeonButton>
                </div>

                {perkToast && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/85">
                    {perkToast}
                  </div>
                )}
                </div>
              </div>

              <QuestBoard
                generatedQuests={generatedQuests}
                customQuests={state.customQuests}
                completed={state.completed}
                onComplete={completeQuest}
                onRemoveCustom={handleRemoveCustomQuest}
              />
              <div className="plastic p-5 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-white/45">New quest</label>
                    <input
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddCustomQuest();
                      }}
                      placeholder="Forge your own quest..."
                      className="focus-ring mt-2 w-full rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white/90 placeholder:text-white/35"
                    />
                  </div>
                  <div className="md:w-48">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-white/45">Type</label>
                    <select
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value as QuestType)}
                      className="focus-ring mt-2 rounded-2xl border border-white/12 bg-black/30 px-4 py-3 text-sm text-white"
                    >
                      <option value="quick">Quick</option>
                      <option value="build">Build</option>
                      <option value="boss">Boss</option>
                    </select>
                  </div>
                  <div className="md:self-end">
                    <NeonButton
                      variant="primary"
                      onClick={handleAddCustomQuest}
                      className={`w-full justify-center text-xs md:mb-[2px] md:w-auto ${canAddQuest ? "" : "pointer-events-none opacity-40"}`}
                      ariaLabel="Add custom quest"
                      aria-disabled={!canAddQuest}
                    >
                      ADD QUEST
                    </NeonButton>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/45">Custom quests persist even if you reset the run.</div>
              </div>
            </div>

            <div className="space-y-6">
              <RecapCard
                classId={cls?.id ?? null}
                classNameLabel={cls?.name ?? "Runner"}
                level={state.level}
                streak={state.streak}
                aura={aura}
                questsCompleted={questsCompleted}
                totalQuests={totalQuests}
                xpEarned={state.xpEarnedThisRun}
                moment={momentLine}
              />
              <WorldFeed playerClassName={cls?.name ?? "Player"} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <LevelUpModal open={levelUpOpen} onClose={() => setLevelUpOpen(false)} newLevel={newLevel} />
    </LevelsWorldShell>
  );
}
