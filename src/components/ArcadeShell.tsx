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
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-[calc(1.75rem+env(safe-area-inset-top))] sm:px-6 md:px-10">
          <header className="w-full text-[10px] uppercase tracking-[0.35em] text-white/70">
            <div className="flex flex-col gap-3 md:hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 font-[var(--font-display)] text-[11px] text-white/80">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white/80" />
                  CODY // ARCADE_OS
                </div>
                <div className="flex items-center gap-4 text-[10px] tracking-[0.4em] text-white/70">
                  <span className="flex items-center gap-1">
                    CREDITS <span className="text-white">01</span>
                  </span>
                  <span className="text-white/50">MODE: SELECT</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-center text-[10px] tracking-[0.45em] text-white/60">
                <span>↑↓ SELECT • ENTER START</span>
                {showBack && (
                  <NeonButton
                    variant="ghost"
                    onClick={() => router.push("/")}
                    className="w-full justify-center gap-2 text-[11px] tracking-[0.35em]"
                    ariaLabel="Back to Start"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    BACK TO START
                  </NeonButton>
                )}
              </div>
            </div>

            <div className="hidden grid-cols-1 items-center gap-4 text-xs text-white/70 sm:grid-cols-[1fr_auto_1fr] md:grid">
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
            </div>
          </header>

          <main className="mt-8 flex-1 w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
