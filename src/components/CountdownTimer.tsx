"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCountdownData } from "@/lib/utils";
import { summitInfo } from "@/lib/data";

type TimeUnit = {
  value: number;
  label: string;
};

function TimeBlock({ value, label }: TimeUnit) {
  const display = label === "Days" ? String(value) : String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={display}
        initial={{ scale: 1.2, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-[5rem] h-[5rem] sm:w-24 sm:h-24 lg:w-28 lg:h-28 glass-gold rounded-xl flex items-center justify-center mb-1"
      >
        <div className="absolute inset-0 rounded-xl animated-border p-[1px]">
          <div className="w-full h-full rounded-xl bg-[var(--bg-surface)] flex items-center justify-center px-1">
            <span
              className="text-3xl sm:text-4xl lg:text-5xl font-black leading-none gradient-text tabular-nums tracking-tight"
              suppressHydrationWarning
            >
              {display}
            </span>
          </div>
        </div>
      </motion.div>
      <span className="text-[10px] sm:text-xs uppercase tracking-widest font-medium text-theme-primary">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set initial value and mark as mounted on the client only
    setCountdown(getCountdownData(summitInfo.startDate));
    setMounted(true);

    const timer = setInterval(() => {
      setCountdown(getCountdownData(summitInfo.startDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const units: TimeUnit[] = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Minutes" },
    { value: countdown.seconds, label: "Seconds" },
  ];

  // Render placeholder blocks server-side / before mount to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="text-center">
        <p className="text-xs sm:text-sm uppercase tracking-widest mb-3 font-medium text-theme-primary">
          Countdown to Summit Opening
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {["Days", "Hours", "Minutes", "Seconds"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center">
                <div className="w-[5rem] h-[5rem] sm:w-24 sm:h-24 lg:w-28 lg:h-28 glass-gold rounded-xl flex items-center justify-center mb-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black leading-none gradient-text tabular-nums tracking-tight">
                    --
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-medium text-theme-primary">
                  {label}
                </span>
              </div>
              {i < 3 && (
                <span className="text-[#C9921A] text-xl sm:text-2xl font-bold mb-4 opacity-60">:</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-[10px] sm:text-xs mt-3 text-theme-primary">
          {summitInfo.dates} · {summitInfo.venue} · {summitInfo.location}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-xs sm:text-sm uppercase tracking-widest mb-3 font-medium text-theme-primary">
        Countdown to Summit Opening
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
            <TimeBlock value={unit.value} label={unit.label} />
            {i < units.length - 1 && (
              <span className="text-[#C9921A] text-xl sm:text-2xl font-bold mb-4 opacity-60">:</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-[10px] sm:text-xs mt-3 text-theme-primary">
        {summitInfo.dates} · {summitInfo.venue} · {summitInfo.location}
      </p>
    </div>
  );
}
