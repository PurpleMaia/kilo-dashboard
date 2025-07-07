import React from "react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b">
      <div className="flex items-center gap-2">
        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
          <span className="h-2 w-2 bg-green-500 rounded-full inline-block" /> Online
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">admin</span>
        <span className="bg-gray-200 text-xs px-2 py-1 rounded">Admin</span>
      </div>
    </header>
  );
}
