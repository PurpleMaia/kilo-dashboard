// Example Kilo Journal entries for demo purposes
export type JournalEntry = {
  id: string;
  date: string;
  title: string;
  content: string;
};

export const journalEntries: JournalEntry[] = [
  {
    id: "1",
    date: "2025-07-07",
    title: "Morning Observations",
    content: "Checked water levels and found the top-bed slightly low. Nitrogen levels high in Patch 1. Noted increased bird activity.",
  },
  {
    id: "2",
    date: "2025-07-06",
    title: "Afternoon Kilo",
    content: "Temperature sensors reported a spike at noon. VOC sensor flagged possible fertilizer use nearby. All other readings normal.",
  },
  {
    id: "3",
    date: "2025-07-05",
    title: "Rainfall Event",
    content: "Heavy rain overnight. Rainfall sensor recorded 2.1 inches. Soil moisture up in all patches. Phosphorus low in Patch 3.",
  },
];
