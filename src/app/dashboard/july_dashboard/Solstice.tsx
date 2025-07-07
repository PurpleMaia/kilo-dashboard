import React from "react";

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
    <div className="flex flex-col items-center justify-center">
      <span className="font-medium text-lg">{next.name}</span>
      <span className="text-sm text-gray-500">{next.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      <span className="text-xs text-blue-600 mt-1">{daysLeft} days left</span>
    </div>
  );
}
