"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import NeonButton from "@/components/NeonButton";

export type ProjectCardModel = {
  id: string;
  title: string;
  tagline: string;
  micro: string;
  cta: string;
  accent: string;
  accent2: string;
  worldName: string;
};

function hexToRgbTuple(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "");
  const bigint = Number.parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export default function ProjectCard({
  model,
  selected,
  onSelect,
  onEnter,
  variant = "compact",
  cardRef,
}: {
  model: ProjectCardModel;
  selected: boolean;
  onSelect: () => void;
  onEnter: () => void;
  variant?: "featured" | "compact";
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  const accentRgb = React.useMemo(() => hexToRgbTuple(model.accent).join(" "), [model.accent]);
  const accent2Rgb = React.useMemo(() => hexToRgbTuple(model.accent2).join(" "), [model.accent2]);
  const accentStyle = React.useMemo(
    () => ({ "--card-accent": accentRgb, "--card-accent2": accent2Rgb }) as React.CSSProperties,
    [accentRgb, accent2Rgb]
  );

  return (
    <motion.div
      layout
      ref={cardRef}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onEnter();
        if (e.key === " ") onSelect();
      }}
      className={cn(
        "focus-ring plastic group relative min-w-0 cursor-pointer overflow-hidden transition-all duration-300",
        variant === "featured" ? "p-6 sm:p-8" : "p-4 sm:p-5",
        selected ? "shadow-[0_35px_85px_rgba(0,0,0,0.75)]" : "shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
        variant === "featured" ? "min-h-[360px] sm:min-h-[380px]" : "min-h-[150px]"
      )}
      style={accentStyle}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      aria-label={`Select ${model.title}`}
    >
      {variant === "featured" && (
        <div className="marquee mb-4 flex items-center justify-between rounded-[18px] px-5 py-2 text-[11px] font-[var(--font-display)] tracking-[0.35em] text-white/80">
          <span>WORLD // {model.worldName}</span>
          <span className="text-white/60">{selected ? "ACTIVE" : "READY"}</span>
        </div>
      )}
      {variant === "featured" && selected && <div className="led-chase pointer-events-none" />}

      <div className="relative z-10 flex h-full flex-col gap-4">
        {variant !== "featured" && (
          <div className="flex items-center justify-between text-[11px] font-[var(--font-display)] tracking-[0.35em] text-white/75">
            <span>WORLD</span>
            <span className="text-white">{model.worldName}</span>
          </div>
        )}

        <div>
          <div className={cn("font-semibold leading-tight tracking-tight text-white", variant === "featured" ? "text-4xl" : "text-2xl")}>
            {model.title}
          </div>
          <p
            className={cn("mt-2 text-white/80", variant === "featured" ? "text-lg leading-snug" : "text-sm leading-snug")}
            style={
              variant === "featured"
                ? undefined
                : { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }
            }
          >
            {model.tagline}
          </p>
          {variant === "featured" && <p className="mt-3 text-base text-white/70">{model.micro}</p>}
        </div>

        {variant === "featured" ? (
          <NeonButton variant="primary" onClick={onEnter} className="mt-auto w-full justify-center" style={{ "--accent-rgb": accentRgb } as React.CSSProperties}>
            {model.cta}
          </NeonButton>
        ) : (
          <div className="mt-auto text-xs uppercase tracking-[0.4em] text-white/60">Tap to enter</div>
        )}
      </div>
    </motion.div>
  );
}
