"use client";
import React, { useState } from "react";
import Card from "@/app/components/dashboard/Card";

export default function Notes() {
  const [notes, setNotes] = useState<string>("");

  return (
    <Card title="Kilo Notes">
      <textarea
        className="w-full min-h-[200px] p-2 border border-gray-200 rounded bg-gray-50 text-sm"
        placeholder="Write your notes here..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
    </Card>
  );
}
