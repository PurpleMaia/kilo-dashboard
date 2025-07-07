import React from "react";

export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-2">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      {children}
    </div>
  );
}
