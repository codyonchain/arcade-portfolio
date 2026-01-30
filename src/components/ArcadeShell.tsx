"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import NeonButton from "@/components/NeonButton";

export default function ArcadeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const showBack = pathname !== "/";

  return (
    <div className="relative min-h-screen">
      <div className="skybox" />
      <div className="sparkles" />
      <div className="vignette" />
      <div className="relative z-10">
        <header className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-4 px-6 py-6 text-xs uppercase tracking-[0.35em] text-white/70 sm:grid-cols-[1fr_auto_1fr] md:px-10 md:py-8">
          <div className="flex items-center gap-2 font-[var(--font-display)] text-[11px]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white/80" />
            CODY // ARCADE_OS
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] tracking-[0.4em] text-white/70">
            <span className="flex items-center gap-2">
              CREDITS: <span className="text-white">01</span>
            </span>
            <span className="text-white/50">MODE: SELECT</span>
          </div>

          <div className="flex items-center justify-start gap-2 text-[10px] tracking-[0.4em] text-white/60 sm:justify-end">
            {showBack ? (
              <NeonButton
                variant="ghost"
                onClick={() => router.push("/")}
                className="gap-2 tracking-[0.3em]"
                ariaLabel="Back to Start"
              >
                <ArrowLeft className="h-4 w-4" />
                BACK
              </NeonButton>
            ) : (
              <span>↑↓ SELECT • ENTER START</span>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">{children}</main>
      </div>
    </div>
  );
}
