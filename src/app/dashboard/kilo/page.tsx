'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import KiloForm from "@/app/components/kilo/KiloForm";

type Entry = {
  id: number;
  name: string;
  date: string;
  [key: string]: any;
};

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
  planting_action: "Planting Action",
};

const LOCAL_STORAGE_KEY = "kilo_entries";

export default function Page() {
  const [entries, setEntries] = useState<Entry[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    }
    return [];
  });
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // Handler to add a new entry with a unique ID
  const handleSave = (data: any) => {
    const id = entries.length ? entries[entries.length - 1].id + 1 : 1;
    const entry = { ...data, id, date: new Date().toLocaleDateString() };
    setEntries([...entries, entry]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] divide-y divide-gray-200">
      {/* Top: Kilo Entry Form */}
      <div className="h-1/2 overflow-y-auto p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Kilo Entry</h2>
        <KiloForm onSaved={handleSave} />
      </div>
      {/* Bottom: Kilo Journal Table */}
      <div className="h-1/2 overflow-y-auto p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Kilo Journal</h2>
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">View</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry: any) => (
              <tr key={entry.id}>
                <td className="p-2 border-b">{entry.id}</td>
                <td className="p-2 border-b">{entry.name}</td>
                <td className="p-2 border-b">{entry.date}</td>
                <td className="p-2 border-b">
                  <button
                    className="text-purple-600 underline"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedEntry && (
          <div className="bg-white rounded shadow p-4 mb-4">
            <h4 className="font-semibold mb-2">Kilo Entry #{selectedEntry.id}</h4>
            <div className="mb-2 text-sm text-gray-500">Saved: {selectedEntry.date}</div>
            <table className="min-w-full text-xs mb-4">
              <tbody>
                {Object.keys(fieldLabels).map((key) =>
                  selectedEntry[key] !== undefined && (
                    <tr key={key}>
                      <th className="text-left font-medium p-1 w-1/3">{fieldLabels[key]}</th>
                      <td className="p-1">
                        {Array.isArray(selectedEntry[key])
                          ? selectedEntry[key].join(", ")
                          : selectedEntry[key]}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <button
              className="mt-4 text-purple-600 underline text-xs"
              onClick={() => setSelectedEntry(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}