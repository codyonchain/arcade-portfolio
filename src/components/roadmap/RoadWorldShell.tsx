"use client";

import { useEffect } from "react";

export default function RoadWorldShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-rgb", "166 255 77");
    root.style.setProperty("--accent2-rgb", "77 255 213");
    root.style.setProperty("--bg1-rgb", "8 27 18");
    root.style.setProperty("--bg2-rgb", "20 59 29");
  }, []);

  return <div className="space-y-8 pb-16">{children}</div>;
}
