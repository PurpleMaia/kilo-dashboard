'use client'
import { CardTitle } from "@/app/ui/card";
import { Button } from "@/app/ui/button";
import { X } from "lucide-react";

interface Test {
  id: string;
  type: string;
  date: string;
  sampler: string;
  data: Array<{
    site: string;
    [key: string]: string | number | undefined;
  }>;
}

interface TestDetailPopupProps {
  test: Test | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TestDetailPopup({ test, isOpen, onClose }: TestDetailPopupProps) {
  if (!isOpen || !test) return null;

  const renderDataTable = (data: Test['data']) => {
    if (data.length === 0) return <p>No data available</p>;

    const keys = Object.keys(data[0]).filter(key => key !== 'site');
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Site</th>
              {keys.map((key) => (
                <th key={key} className="border border-gray-300 px-3 py-2 text-left font-semibold">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-3 py-2 font-medium">{row.site}</td>
                {keys.map((key) => (
                  <td key={key} className="border border-gray-300 px-3 py-2">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto touch-pan-y">
        <div className="flex justify-between items-center p-6 border-b">
          <CardTitle className="text-xl">{test.type}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Test ID</span>
              <span className="text-lg">{test.id}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Date</span>
              <span className="text-lg">{test.date}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Sampler</span>
              <span className="text-lg">{test.sampler}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
            {renderDataTable(test.data)}
          </div>
        </div>
      </div>
    </div>
  );
} 