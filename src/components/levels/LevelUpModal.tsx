"use client";

import { motion } from "framer-motion";
import NeonButton from "@/components/NeonButton";

export default function LevelUpModal({
  open,
  onClose,
  newLevel,
}: {
  open: boolean;
  onClose: () => void;
  newLevel: number;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-6">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto w-full max-w-md rounded-3xl border border-white/12 bg-[#0b0b10]/90 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.6)]"
        >
          <div className="font-[var(--font-display)] text-[10px] tracking-[0.22em] text-white/55">LEVEL UP</div>
          <div className="mt-2 text-3xl font-semibold text-white/90 crt-text">Level {newLevel}</div>
          <div className="mt-2 text-sm text-white/70">Aura strengthened. Keep the streak alive.</div>
          <div className="mt-6">
            <NeonButton variant="primary" onClick={onClose} className="w-full justify-center">
              KEEP PLAYING
            </NeonButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
