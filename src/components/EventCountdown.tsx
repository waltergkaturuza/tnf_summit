"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCountdownData } from "@/lib/utils";

type TimeUnit = { value: number; label: string };

function TimeBlock({ value, label }: TimeUnit) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-16 h-16 sm:w-20 sm:h-20 glass-gold rounded-xl flex items-center justify-center mb-2"
      >
        <div className="absolute inset-0 rounded-xl animated-border p-[1px]">
          <div className="w-full h-full rounded-xl bg-[var(--bg-surface)] flex items-center justify-center">
            <span
              className="text-2xl sm:text-3xl font-black gradient-text tabular-nums"
              suppressHydrationWarning
            >
              {String(value).padStart(2, "0")}
            </span>
          </div>
        </div>
      </motion.div>
      <span className="text-xs uppercase tracking-widest font-medium text-theme-primary">
        {label}
      </span>
    </div>
  );
}

export default function EventCountdown({
  targetDate,
  label = "Countdown to Event",
}: {
  targetDate: Date;
  label?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setCountdown(getCountdownData(targetDate));
    setMounted(true);
    const timer = setInterval(() => setCountdown(getCountdownData(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest mb-4 font-medium text-theme-primary">
          {label}
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {["Days", "Hours", "Minutes", "Seconds"].map((l, i) => (
            <div key={l} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 glass-gold rounded-xl flex items-center justify-center mb-2">
                  <span className="text-2xl sm:text-3xl font-black gradient-text tabular-nums">--</span>
                </div>
                <span className="text-xs uppercase tracking-widest font-medium text-theme-primary">{l}</span>
              </div>
              {i < 3 && <span className="text-[#C9921A] text-xl font-bold mb-6 opacity-60">:</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const units: TimeUnit[] = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Minutes" },
    { value: countdown.seconds, label: "Seconds" },
  ];

  return (
    <div className="text-center">
      <p className="text-sm uppercase tracking-widest mb-4 font-medium text-theme-primary">
        {label}
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
            <TimeBlock value={unit.value} label={unit.label} />
            {i < units.length - 1 && (
              <span className="text-[#C9921A] text-xl font-bold mb-6 opacity-60">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
