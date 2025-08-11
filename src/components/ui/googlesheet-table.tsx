'use client'

import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface GoogleSheetTableProps {
  sheetId: string;
  range: string; // e.g., "Sheet1!A1:Z1000"
  title?: string;
  apiKey?: string; // Google Sheets API key
}

interface SheetData {
  headers: string[];
  rows: string[][];
}

export default function GoogleSheetTable({ 
  sheetId, 
  range, 
  title = "Kilo Data", 
  apiKey 
}: GoogleSheetTableProps) {
  const [data, setData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [timestamp, setTimestamp] = useState<string>('');

  // Update timestamp on client side only
  useEffect(() => {
    setTimestamp(new Date().toLocaleString());
  }, []);

  useEffect(() => {
    const fetchSheetData = async () => {
      if (!apiKey) {
        setError('Google Sheets API key required');
        setLoading(false);
        return;
      }

      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch sheet data');
        }

        const result = await response.json();
        const values = result.values || [];
        
        if (values.length === 0) {
          setError('No data found in sheet');
          setLoading(false);
          return;
        }

        const headers = values[0];
        const rows = values.slice(1);
        
        setData({ headers, rows });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, [sheetId, range, apiKey]);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    if (!data || sortColumn === null) return data?.rows || [];

    return [...data.rows].sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      
      if (sortDirection === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading sheet data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const sortedRows = getSortedData();

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">
          {data?.rows.length || 0} rows of data • Last updated: {timestamp}
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {data?.headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(index)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{header}</span>
                      {sortColumn === index && (
                        sortDirection === 'asc' ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cell || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 