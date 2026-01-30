"use client";

import { useEffect } from "react";

export default function FlipWorldShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-rgb", "255 184 77");
    root.style.setProperty("--accent2-rgb", "255 94 138");
    root.style.setProperty("--bg1-rgb", "27 18 8");
    root.style.setProperty("--bg2-rgb", "74 44 16");
  }, []);

  return <div className="space-y-8 pb-16">{children}</div>;
}
