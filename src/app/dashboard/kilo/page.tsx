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

const LOCAL_STORAGE_KEY = "kilo_entries";

export default function Page() {
  const [entries, setEntries] = useState<Entry[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    }
    return [];
  });

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
                  <Link href={`/dashboard/kilo/entry/${entry.id}`} className="text-purple-600 underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}