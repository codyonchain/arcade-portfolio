"use client";

import { motion } from "framer-motion";
import NeonButton from "@/components/NeonButton";
import { Quest } from "@/lib/levels/types";

function StatTag({ value, done }: { value: string; done: boolean }) {
  return (
    <div
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        done ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 text-white/80"
      }`}
    >
      {value}
    </div>
  );
}

function QuestCard({
  quest,
  done,
  onComplete,
  onRemove,
}: {
  quest: Quest;
  done: boolean;
  onComplete: () => void;
  onRemove?: () => void;
}) {
  return (
    <motion.div layout className="rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white/90">{quest.title}</div>
          <div className="mt-1 text-sm text-white/70">{quest.desc}</div>
        </div>
        <StatTag value={`+${quest.xp} XP`} done={done} />
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <NeonButton
          variant={done ? "ghost" : "primary"}
          onClick={!done ? onComplete : undefined}
          className={`text-xs w-full justify-center sm:w-auto ${done ? "pointer-events-none opacity-50" : ""}`}
          aria-disabled={done}
        >
          {done ? "COMPLETED" : "COMPLETE"}
        </NeonButton>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs uppercase tracking-wide text-white/45 hover:text-white/90"
          >
            Remove
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function QuestBoard({
  generatedQuests,
  customQuests,
  completed,
  onComplete,
  onRemoveCustom,
}: {
  generatedQuests: Quest[];
  customQuests: Quest[];
  completed: Record<string, boolean>;
  onComplete: (q: Quest) => void;
  onRemoveCustom?: (id: string) => void;
}) {
  const renderList = (quests: Quest[], showRemove: boolean) => {
    if (!quests.length) {
      return (
        <div className="rounded-2xl border border-white/5 bg-black/10 px-4 py-8 text-center text-sm text-white/60">
          No {showRemove ? "custom" : "core"} quests yet.
        </div>
      );
    }

    return quests.map((quest) => {
      const done = !!completed[quest.id];
      return (
        <QuestCard
          key={quest.id}
          quest={quest}
          done={done}
          onComplete={() => onComplete(quest)}
          onRemove={showRemove ? () => onRemoveCustom?.(quest.id) : undefined}
        />
      );
    });
  };

  return (
    <div className="plastic glow-border p-6">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">QUEST BOARD</div>
      <div className="mt-2 text-xl font-semibold tracking-tight crt-text">Today’s Quests</div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/45">Core Quests</div>
          <div className="mt-2 space-y-3">{renderList(generatedQuests, false)}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/45">Custom Quests</div>
          <div className="mt-2 space-y-3">{renderList(customQuests, true)}</div>
        </div>
      </div>
    </div>
  );
}
