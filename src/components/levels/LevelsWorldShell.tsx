"use client";

import { useEffect } from "react";

export default function LevelsWorldShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-rgb", "192 124 255");
    root.style.setProperty("--accent2-rgb", "255 79 216");
    root.style.setProperty("--bg1-rgb", "20 10 34");
    root.style.setProperty("--bg2-rgb", "43 15 85");
  }, []);

  return <div className="space-y-8">{children}</div>;
}
