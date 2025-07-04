'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AgTestCard, { AgTestCardProps } from './components/AgTestCard';
import PreviousAgTests, { AgTest } from './components/PreviousAgTests';

export default function AgTesting() {
  const [tests, setTests] = useState<AgTest[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('ag_tests');
    if (stored) setTests(JSON.parse(stored));
  }, []);

  const handleTestSaved = (test: AgTest) => {
    setTests((prev: AgTest[]) => {
      const updated = [...prev, test];
      localStorage.setItem('ag_tests', JSON.stringify(updated));
      return updated;
    });
  };

  const soilFields = [
    { label: 'pH Level', value: 7.2, unit: '', isHigh: false, isLow: true },
    { label: 'Nitrogen', value: 120, unit: 'ppm', isHigh: true, isLow: false },
    { label: 'Phosphorus', value: 65, unit: 'ppm', isHigh: false, isLow: false },
    { label: 'Potassium', value: 140, unit: 'ppm', isHigh: false, isLow: false },
    { label: 'Organic Matter', value: 3.5, unit: '%', isHigh: false, isLow: false }
  ];

  const waterFields = [
    { label: 'pH', value: 7.5, unit: '', isHigh: false, isLow: false },
    { label: 'TDS', value: 150, unit: 'ppm', isHigh: false, isLow: false },
    { label: 'EC', value: 250, unit: '\u00b5S/cm', isHigh: false, isLow: false },
    { label: 'Hardness', value: 120, unit: 'mg/L', isHigh: false, isLow: false },
    { label: 'Alkalinity', value: 180, unit: 'mg/L', isHigh: false, isLow: false }
  ];

  const ecoliFields = [
    { label: 'CFU', value: 95, unit: 'count/100ml', isHigh: false, isLow: false },
    { label: 'Temperature', value: 78, unit: '\u00b0F', isHigh: false, isLow: false },
    { label: 'pH', value: 7.2, unit: '', isHigh: false, isLow: false },
    { label: 'Turbidity', value: 0.5, unit: 'NTU', isHigh: false, isLow: false },
    { label: 'Conductivity', value: 350, unit: '\u00b5S/cm', isHigh: false, isLow: false }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Agricultural Testing Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AgTestCard
          type="soil"
          title="Soil Test"
          fields={soilFields}
          onSaved={handleTestSaved}
        />

        <AgTestCard
          type="water"
          title="Water Quality"
          fields={waterFields}
          onSaved={handleTestSaved}
        />

        <AgTestCard
          type="ecoli"
          title="E. coli Test"
          fields={ecoliFields}
          onSaved={handleTestSaved}
        />
      </div>

      {/* Previous Ag Tests section */}
      <PreviousAgTests tests={tests} />
    </div>
  );
}
