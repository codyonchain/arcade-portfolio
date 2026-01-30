"use client";

import { useState } from "react";
import NeonButton from "@/components/NeonButton";
import CharacterAvatar from "@/components/levels/CharacterAvatar";
import { Aura } from "@/lib/levels/types";

export default function RecapCard({
  classId,
  classNameLabel,
  level,
  streak,
  aura,
  questsCompleted,
  totalQuests,
  xpEarned,
  moment,
}: {
  classId: string | null;
  classNameLabel: string;
  level: number;
  streak: number;
  aura: Aura;
  questsCompleted: number;
  totalQuests: number;
  xpEarned: number;
  moment: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareText = `AURA GROVE RECAP\nClass: ${classNameLabel}\nLevel: ${level}\nStreak: ${streak}\nAura: ${aura}\nXP This Run: ${xpEarned}\nQuests: ${questsCompleted}/${totalQuests}\nMoment: ${moment}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="plastic glow-border p-6">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">RECAP CARD</div>
      <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-center">
        <CharacterAvatar classId={classId} />
        <div>
          <div className="crt-text text-2xl font-semibold leading-tight">{classNameLabel}</div>
          <div className="mt-1 text-sm text-white/70">Aura Grove Run Summary</div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Stat label="Level" value={`${level}`} />
            <Stat label="Streak" value={`${streak}`} />
            <Stat label="Aura" value={aura} />
            <Stat label="XP" value={`${xpEarned}`} />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/80">
        <div>Quests Completed: {questsCompleted}/{totalQuests}</div>
        <div className="mt-2 text-white/70">{moment}</div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-xs text-white/70">
        <div className="font-[var(--font-display)] text-[10px] tracking-[0.3em] text-white/50">SHARE TEXT</div>
        <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] leading-5 text-white/80">{shareText}</pre>
      </div>

      <div className="mt-4">
        <NeonButton variant="primary" onClick={handleCopy} className="w-full justify-center text-xs">
          {copied ? "COPIED" : "COPY RECAP"}
        </NeonButton>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white/85">{value}</div>
    </div>
  );
}
