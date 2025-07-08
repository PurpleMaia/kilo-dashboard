import { Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";

// Simple static solstice/equinox dates for 2025
const events = [
  { name: "March Equinox", date: new Date("2025-03-20T06:01:00Z") },
  { name: "June Solstice", date: new Date("2025-06-21T20:42:00Z") },
  { name: "September Equinox", date: new Date("2025-09-22T18:20:00Z") },
  { name: "December Solstice", date: new Date("2025-12-21T09:03:00Z") },
];

function getNextSolsticeOrEquinox(now: Date) {
  return events.find((e) => e.date > now) || events[0];
}

export default function SolsticeCard() {
  const now = new Date();
  const next = getNextSolsticeOrEquinox(now);
  const daysLeft = Math.ceil((next.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-yellow-100 border-orange-200">
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="text-sm md:text-lg flex items-center gap-2">
          <Sun className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
          <span className="hidden sm:inline">Seasonal Info</span>
          <span className="sm:hidden">Season</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 md:space-y-3">
          <div className="text-center space-y-2">
            <div className="font-semibold text-orange-900 text-sm md:text-base">Next: {next.name}</div>
            <div className="text-sm font-bold text-orange-700">{next.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div className="text-xs text-orange-700">{daysLeft} days left</div>
          </div>
          
          {/* <div className="grid grid-cols-2 gap-1 md:gap-2 text-xs hidden sm:grid">
            <div className="text-center">
              <div className="font-medium">Sunrise</div>
              <div className="text-orange-700">{seasonal.sunriseTime}</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Sunset</div>
              <div className="text-orange-700">{seasonal.sunsetTime}</div>
            </div>
          </div>
          
          <div className="text-center text-xs text-orange-600 hidden md:block">
            {seasonal.nextSolstice} in {seasonal.daysUntil} days
          </div> */}

        </div>
      </CardContent>
    </Card>
  );
}