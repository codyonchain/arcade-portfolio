"use client";

import { motion } from "framer-motion";
import { LevelClass } from "@/lib/levels/types";
import { cn } from "@/lib/utils";

export default function CharacterSelect({
  classes,
  selectedId,
  onSelect,
}: {
  classes: LevelClass[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {classes.map((c) => {
        const active = c.id === selectedId;
        return (
          <motion.button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className={cn(
              "plastic glow-border focus-ring w-full text-left p-5 sm:p-6 transition-shadow",
              "min-h-[180px] sm:min-h-[200px]",
              active ? "ring-1 ring-white/25" : "ring-0"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="crt-text text-lg font-semibold">{c.name}</div>
                <div className="mt-1 text-sm text-white/70">{c.power}</div>
              </div>
              <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/45">
                {active ? "ACTIVE" : "READY"}
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm text-white/75">
              <div><span className="text-white/55">Perk:</span> {c.perk}</div>
              <div><span className="text-white/55">Weakness:</span> {c.weakness}</div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
