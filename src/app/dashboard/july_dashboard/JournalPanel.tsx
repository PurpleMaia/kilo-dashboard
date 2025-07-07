"use client";
"use client";
import React, { useState, useEffect } from "react";
import Card from "@/app/components/dashboard/Card";
import { useKiloJournalEntries, KiloJournalEntry } from "./useKiloJournalEntries";

export default function JournalPanel() {
  const entries = useKiloJournalEntries();
  const [selected, setSelected] = useState<KiloJournalEntry | null>(null);

  useEffect(() => {
    if (entries.length > 0 && !selected) setSelected(entries[0]);
  }, [entries]);

  return (
    <Card title="Kilo Journal">
      {entries.length === 0 ? (
        <div className="text-gray-500 text-sm">No journal entries found. Add entries on the Kilo Journal page.</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-48 w-full">
            <ul className="space-y-2">
              {entries.map(entry => (
                <li key={entry.id}>
                  <button
                    className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 transition ${selected?.id === entry.id ? "bg-gray-200 font-semibold" : ""}`}
                    onClick={() => setSelected(entry)}
                  >
                    <div className="text-xs text-gray-500">{entry.date}</div>
                    <div className="truncate text-sm">{entry.name}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 min-w-0">
            {selected && (
              <div>
                <div className="text-xs text-gray-500 mb-1">{selected.date}</div>
                <div className="font-semibold mb-2">{selected.name}</div>
                <div className="whitespace-pre-line text-sm text-gray-700 bg-gray-50 rounded p-3 border border-gray-100">
                  {Object.entries(selected)
                    .filter(([key]) => !["id", "name", "date"].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="mb-1">
                        <span className="font-medium text-xs text-gray-400 mr-2">{key.replace(/_/g, " ")}</span>
                        <span>{Array.isArray(value) ? value.join(", ") : value}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
