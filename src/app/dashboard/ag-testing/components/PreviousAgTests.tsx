"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export interface AgTest {
  id: number;
  date: string;
  type: string;
  title: string;
  fields: { label: string; value: string | number; unit?: string }[];
}

export default function PreviousAgTests({ tests }: { tests: AgTest[] }) {
  const [selected, setSelected] = useState<AgTest | null>(null);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Previous Ag Tests</h3>
      {tests.length === 0 ? (
        <div className="text-gray-500">No previous tests saved.</div>
      ) : (
        <table className="min-w-full text-sm border border-gray-200 rounded-lg mb-4">
          <thead>
            <tr>
              <th className="p-2 border-b text-left">ID</th>
              <th className="p-2 border-b text-left">Date</th>
              <th className="p-2 border-b text-left">Title</th>
              <th className="p-2 border-b text-left">View</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id}>
                <td className="p-2 border-b">{test.id}</td>
                <td className="p-2 border-b">{test.date}</td>
                <td className="p-2 border-b">{test.title}</td>
                <td className="p-2 border-b">
                  <button
                    className="text-purple-600 underline"
                    onClick={() => setSelected(test)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selected && (
        <div className="bg-white rounded shadow p-4 mb-4">
          <h4 className="font-semibold mb-2">Test #{selected.id} - {selected.title}</h4>
          <div className="mb-2 text-sm text-gray-500">Saved: {selected.date}</div>
          <table className="min-w-full text-xs">
            <tbody>
              {selected.fields.map((field) => (
                <tr key={field.label}>
                  <th className="text-left font-medium p-1 w-1/3">{field.label}</th>
                  <td className="p-1">{field.value}{field.unit ? ` ${field.unit}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="mt-4 text-purple-600 underline text-xs"
            onClick={() => setSelected(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
