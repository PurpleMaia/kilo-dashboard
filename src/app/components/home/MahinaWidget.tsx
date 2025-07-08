import React from "react";
import { Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";

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

export default function MahinaWidget() {
  const today = new Date();
  const { phase, emoji } = getMoonPhase(today);
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 border-purple-200">
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="text-sm md:text-lg flex items-center gap-2">
          <Moon className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
          <span className="hidden sm:inline">Moon Phase</span>
          <span className="sm:hidden">Moon</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 md:space-y-3">
          <div className="text-center">
            <div className="text-2xl md:text-3xl mb-1 md:mb-2">{emoji}</div>
            <div className="font-semibold text-purple-900 text-xs md:text-sm">{phase}</div>
          </div>                  
        </div>
      </CardContent>
    </Card>
  );
}
