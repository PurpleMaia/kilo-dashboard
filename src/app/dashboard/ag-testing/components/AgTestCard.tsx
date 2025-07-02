'use client';

import { useState } from 'react';
import { WaterDropIcon, SoilIcon, BacteriaIcon } from '@/app/ui/icons';

interface AgTestCardProps {
  type: 'water' | 'soil' | 'ecoli';
  title: string;
  fields: {
    label: string;
    value: string | number;
    unit?: string;
    isEditable?: boolean;
    isHigh?: boolean;
    isLow?: boolean;
  }[];
}

export default function AgTestCard({ type, title, fields }: AgTestCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(fields);

  const handleInputChange = (index: number, value: string | number) => {
    const newFormData = [...formData];
    newFormData[index].value = value;
    setFormData(newFormData);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const getBackgroundColor = (isHigh: boolean | undefined, isLow: boolean | undefined) => {
    if (isHigh) return 'bg-red-50';
    if (isLow) return 'bg-yellow-50';
    return 'bg-white';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={handleEditToggle}
          className="text-sm font-medium text-purple-600 hover:text-purple-700"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.map((field, index) => (
          <div
            key={field.label}
            className={`p-4 rounded-lg ${getBackgroundColor(field.isHigh, field.isLow)}`}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={field.value.toString()}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{field.value}</span>
                {field.unit && <span className="text-sm text-gray-500">{field.unit}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
