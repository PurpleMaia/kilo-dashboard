"use client";
import { useState, useEffect } from "react";

export interface KiloJournalEntry {
  id: number;
  name: string;
  date: string;
  [key: string]: any;
}

const LOCAL_STORAGE_KEY = "kilo_entries";

export function useKiloJournalEntries() {
  const [entries, setEntries] = useState<KiloJournalEntry[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    }
  }, []);

  return entries;
}
