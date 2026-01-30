"use client";

import { useMemo } from "react";
import NeonButton from "@/components/NeonButton";
import { FinishLevel, RehabLineItem } from "@/lib/flipcalc/types";
import { defaultRehabLineItems, money, sumLineItems } from "@/lib/flipcalc/calc";
import { cn } from "@/lib/utils";

export default function RehabEditor({
  sqft,
  yearBuilt,
  finish,
  setFinish,
  items,
  setItems,
}: {
  sqft: number;
  yearBuilt: number;
  finish: FinishLevel;
  setFinish: (v: FinishLevel) => void;
  items: RehabLineItem[];
  setItems: (items: RehabLineItem[]) => void;
}) {
  const total = useMemo(() => sumLineItems(items), [items]);

  const preset = (level: FinishLevel) => {
    setFinish(level);
    setItems(defaultRehabLineItems(sqft, yearBuilt, level));
  };

  return (
    <div className="plastic p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">REHAB</div>
          <div className="mt-2 text-xl font-semibold tracking-tight crt-text">Rehab preset + line items</div>
          <div className="mt-1 text-sm text-white/70">Start with a preset, then tweak the numbers.</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
          <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">TOTAL</div>
          <div className="mt-1 text-sm font-semibold text-white/90">{money(total)}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["Low", "Standard", "High"] as FinishLevel[]).map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => preset(lvl)}
            className={cn(
              "focus-ring rounded-full border px-4 py-2 text-xs transition-all",
              finish === lvl
                ? "border-white/22 bg-white/14 text-white shadow-[0_0_20px_rgba(255,184,77,0.18)]"
                : "border-white/12 bg-white/6 text-white/75 hover:bg-white/10 hover:text-white"
            )}
          >
            {lvl.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {items.map((it, idx) => (
          <div key={it.id} className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_160px]">
            <input
              value={it.name}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...it, name: e.target.value };
                setItems(next);
              }}
              className="focus-ring rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-base text-white/85"
            />
            <input
              value={String(it.cost)}
              onChange={(e) => {
                const numeric = Number(e.target.value.replace(/[^0-9]/g, ""));
                const next = [...items];
                next[idx] = { ...it, cost: Number.isFinite(numeric) ? numeric : 0 };
                setItems(next);
              }}
              className="focus-ring rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-base text-white/85"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <NeonButton
          variant="ghost"
          onClick={() => setItems([...items, { id: `li_${Date.now()}`, name: "New line item", cost: 0 }])}
          className="text-xs"
        >
          ADD LINE ITEM
        </NeonButton>
      </div>
    </div>
  );
}
