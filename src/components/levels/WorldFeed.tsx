"use client";

import { useEffect, useMemo, useState } from "react";

export default function WorldFeed({ playerClassName }: { playerClassName: string }) {
  const [items, setItems] = useState<string[]>([]);

  const templates = useMemo(
    () => [
      `${playerClassName} completed a Quick Quest.`,
      `A Chaos Mage defeated a Boss Fight.`,
      `A Monk hit a 7-day streak.`,
      `A Builder shipped a “done is done” task.`,
      `A Ranger entered Deep Work.`,
      `A Paladin resisted distractions.`,
      `Aura upgraded: Glowing → Charged.`,
      `${playerClassName} forged a custom quest.`,
    ],
    [playerClassName]
  );

  useEffect(() => {
    const push = () => {
      const msg = templates[Math.floor(Math.random() * templates.length)];
      setItems((prev) => [msg, ...prev].slice(0, 6));
    };
    push();
    const id = setInterval(push, 3000);
    return () => clearInterval(id);
  }, [templates]);

  return (
    <div className="plastic p-6">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">WORLD FEED</div>
      <div className="mt-3 space-y-2 text-sm text-white/75">
        {items.map((m, i) => (
          <div key={`${m}_${i}`} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}
