"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

export default function NeonButton({
  children,
  onClick,
  href,
  className,
  variant = "primary",
  type = "button",
  ariaLabel,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: Variant;
  type?: "button" | "submit";
  ariaLabel?: string;
  style?: React.CSSProperties;
}) {
  const base =
    "focus-ring relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3 text-sm font-semibold tracking-[0.25em] transition-all duration-200";

  const styles =
    variant === "primary"
      ? "border border-white/25 bg-[rgba(var(--accent-rgb),0.35)] text-white shadow-[0_20px_30px_rgba(0,0,0,0.6)] before:absolute before:inset-[2px] before:rounded-full before:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_60%)] before:opacity-70 before:content-[''] after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_-6px_12px_rgba(0,0,0,0.35)] after:content-[''] active:translate-y-[2px] active:shadow-[0_10px_18px_rgba(0,0,0,0.6)]"
      : "border border-white/15 bg-transparent text-white/75 hover:border-white/35 hover:text-white";

  if (href) {
    return (
      <a
        href={href}
        className={cn(base, styles, className)}
        aria-label={ariaLabel}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        target={href.startsWith("http") ? "_blank" : undefined}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(base, styles, className)}
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </button>
  );
}
