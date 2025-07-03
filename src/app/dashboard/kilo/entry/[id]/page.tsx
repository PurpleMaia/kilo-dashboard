'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import React from "react";

export default function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [entry, setEntry] = React.useState<any | null>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem("kilo_entries");
    if (stored) {
      const entries = JSON.parse(stored);
      const found = entries.find((e: any) => String(e.id) === String(id));
      setEntry(found || null);
    }
  }, [id]);

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">Kilo Entry Not Found</h1>
        <Link href="/dashboard/kilo" className="text-purple-600 underline text-lg">Back to entries</Link>
      </div>
    );
  }

  // Minimalist table rendering
  const fieldLabels: { [key: string]: string } = {
    name: "Name",
    soil_texture: "Soil Texture",
    soil_moisture: "Soil Moisture",
    soil_life: "Soil Life",
    sky_condition: "Sky Condition",
    rain_today: "Rain Today",
    wind_condition: "Wind Condition",
    leaf_condition: "Leaf Condition",
    growth_rate: "Growth Rate",
    pest_disease: "Pest/Disease",
    beneficial_insects: "Beneficial Insects",
    pest_insects: "Pest Insects",
    larger_animals: "Larger Animals",
    seasonal_markers: "Seasonal Markers",
    moon_phase: "Moon Phase",
    planting_action: "Planting Actions"
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Kilo Entry #{entry.id}</h1>
      <div className="mb-8 w-full max-w-xl bg-white p-6 rounded shadow">
        <table className="min-w-full text-sm">
          <tbody>
            <tr>
              <th className="text-left font-semibold p-2 w-1/3">Date</th>
              <td className="p-2">{entry.date}</td>
            </tr>
            {Object.keys(fieldLabels).map((key) => (
              entry[key] !== undefined && (
                <tr key={key}>
                  <th className="text-left font-semibold p-2 w-1/3">{fieldLabels[key]}</th>
                  <td className="p-2">
                    {Array.isArray(entry[key]) ? entry[key].join(", ") : entry[key]}
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/dashboard/kilo" className="text-purple-600 underline text-lg">Back to entries</Link>
    </div>
  );
}

