"use client";

const CLASS_PALETTES: Record<string, { base: string; accent: string; trim: string }> = {
  monk: { base: "#fdf0c9", accent: "#f1c40f", trim: "#c27c0e" },
  chaos: { base: "#ffd7ef", accent: "#ff5ad7", trim: "#8e44ad" },
  builder: { base: "#ffe1c2", accent: "#f39c12", trim: "#d35400" },
  ranger: { base: "#d6f5d6", accent: "#2ecc71", trim: "#117a65" },
  paladin: { base: "#f4f9ff", accent: "#5dade2", trim: "#1f618d" },
  alchemist: { base: "#e8f6f3", accent: "#1abc9c", trim: "#117864" },
  assassin: { base: "#fef0f0", accent: "#e74c3c", trim: "#78281f" },
  captain: { base: "#fdf1ff", accent: "#bb8fce", trim: "#76448a" },
  default: { base: "#fefefe", accent: "#f368e0", trim: "#8e44ad" },
};

const SPRITE_PATTERN: number[][] = [
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 0],
  [0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 0, 0],
  [0, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 0],
  [0, 0, 1, 2, 1, 1, 1, 1, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 1, 1, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 3, 3, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 3, 3, 3, 3, 1, 1, 0, 0],
  [0, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 0],
  [0, 1, 3, 3, 0, 3, 3, 0, 3, 3, 1, 0],
  [0, 1, 3, 0, 0, 0, 0, 0, 0, 3, 1, 0],
  [0, 1, 3, 0, 0, 0, 0, 0, 0, 3, 1, 0],
  [0, 0, 1, 0, 3, 3, 3, 3, 0, 1, 0, 0],
  [0, 0, 1, 1, 0, 3, 3, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
];

export default function CharacterAvatar({ classId }: { classId: string | null }) {
  const palette = CLASS_PALETTES[classId ?? "default"] ?? CLASS_PALETTES.default;
  const colors: Record<number, string> = {
    0: "transparent",
    1: palette.base,
    2: palette.accent,
    3: palette.trim,
  };

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-3xl border border-white/10 bg-black/30 p-3 shadow-inner shadow-black/40">
        <div
          className="grid gap-[1px]"
          style={{ gridTemplateColumns: `repeat(${SPRITE_PATTERN[0].length}, 8px)` }}
        >
          {SPRITE_PATTERN.flatMap((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <div
                key={`${rowIdx}_${colIdx}`}
                className="h-2 w-2"
                style={{ backgroundColor: colors[cell] }}
              />
            ))
          )}
        </div>
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/45">Avatar</div>
    </div>
  );
}
