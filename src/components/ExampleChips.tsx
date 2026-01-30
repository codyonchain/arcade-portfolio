"use client";

import { cn } from "@/lib/utils";

export default function ExampleChips({
  items,
  value,
  onChange,
  label = "Examples",
}: {
  items: string[];
  value?: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">
        {label.toUpperCase()}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => {
          const active = value === it;
          return (
            <button
              key={it}
              type="button"
              onClick={() => onChange(it)}
              className={cn(
                "focus-ring rounded-full border px-3 py-1 text-xs transition-all",
                active
                  ? "border-white/22 bg-white/14 text-white shadow-[0_0_20px_rgba(110,240,255,0.14)]"
                  : "border-white/12 bg-white/5 text-white/75 hover:bg-white/8 hover:text-white"
              )}
            >
              {it}
            </button>
          );
        })}
      </div>
    </div>
  );
}
