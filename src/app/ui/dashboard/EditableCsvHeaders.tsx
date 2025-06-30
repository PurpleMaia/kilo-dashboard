import React, { useState } from 'react';

interface EditableCsvHeadersProps {
  headers: string[];
  onChange: (headers: string[]) => void;
}

const dummyRow = (headers: string[]) => headers.map((h, i) => `Row1-Col${i+1}`);

export default function EditableCsvHeaders({ headers: initialHeaders, onChange }: EditableCsvHeadersProps) {
  const [headers, setHeaders] = useState(initialHeaders);

  const handleHeaderChange = (idx: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[idx] = value;
    setHeaders(newHeaders);
    onChange(newHeaders);
  };

  const moveHeader = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= headers.length) return;
    const newHeaders = [...headers];
    [newHeaders[idx], newHeaders[newIdx]] = [newHeaders[newIdx], newHeaders[idx]];
    setHeaders(newHeaders);
    onChange(newHeaders);
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow mt-8">
      <h3 className="font-bold mb-2">Edit & Reorder CSV Headers</h3>
      <table className="w-full border">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="p-2 border bg-gray-50">
                <div className="flex items-center gap-1">
                  <input
                    className="border rounded px-2 py-1 w-28 text-sm"
                    value={header}
                    onChange={e => handleHeaderChange(idx, e.target.value)}
                  />
                  <button
                    className="px-1 text-gray-500 hover:text-blue-600"
                    onClick={() => moveHeader(idx, -1)}
                    disabled={idx === 0}
                    title="Move left"
                  >
                    ←
                  </button>
                  <button
                    className="px-1 text-gray-500 hover:text-blue-600"
                    onClick={() => moveHeader(idx, 1)}
                    disabled={idx === headers.length - 1}
                    title="Move right"
                  >
                    →
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {dummyRow(headers).map((cell, idx) => (
              <td key={idx} className="p-2 border text-xs text-gray-500 bg-gray-25">{cell}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
} 