import React from "react";

function getMoonPhase(date: Date): { phase: string; emoji: string } {
  // Simple moon phase calculation
  // Reference: https://gist.github.com/endel/dfe6bb2fbe679781948c
  const lp = 2551443; // lunar period in seconds
  const now = date.getTime() / 1000;
  const new_moon = new Date(1970, 0, 7, 20, 35, 0).getTime() / 1000;
  const phase = ((now - new_moon) % lp) / (24 * 3600);
  const phaseIndex = Math.floor((phase / (lp / (24 * 3600))) * 8) % 8;
  const phases = [
    { phase: "New Moon", emoji: "🌑" },
    { phase: "Waxing Crescent", emoji: "🌒" },
    { phase: "First Quarter", emoji: "🌓" },
    { phase: "Waxing Gibbous", emoji: "🌔" },
    { phase: "Full Moon", emoji: "🌕" },
    { phase: "Waning Gibbous", emoji: "🌖" },
    { phase: "Last Quarter", emoji: "🌗" },
    { phase: "Waning Crescent", emoji: "🌘" },
  ];
  return phases[phaseIndex];
}

export default function MoonPhaseCard() {
  const today = new Date();
  const { phase, emoji } = getMoonPhase(today);
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-4xl mb-2">{emoji}</span>
      <span className="font-medium">{phase}</span>
    </div>
  );
}
