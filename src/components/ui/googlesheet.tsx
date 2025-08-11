'use client'

import { useState, useEffect } from 'react';

interface GoogleSheetProps {
  sheetUrl: string;
  title?: string;
  height?: number;
}

export default function GoogleSheet({ 
  sheetUrl, 
  title = "Kilo Data Sheet", 
  height = 600 
}: GoogleSheetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<string>('');

  // Convert Google Sheets URL to embed format
  const getEmbedUrl = (url: string) => {
    // Extract the sheet ID from various Google Sheets URL formats
    const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (sheetIdMatch) {
      const sheetId = sheetIdMatch[1];
      return `https://docs.google.com/spreadsheets/d/e/${sheetId}/pubhtml?widget=true&headers=false`;
    }
    return url;
  };

  // Update timestamp on client side only
  useEffect(() => {
    setTimestamp(new Date().toLocaleString());
  }, []);

  const embedUrl = getEmbedUrl(sheetUrl);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">Live data from Google Sheets</p>
      </div>

      {/* Sheet Container */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading sheet...</span>
          </div>
        )}

        {/* Google Sheet iframe */}
        <div className="relative">
          <iframe
            src={embedUrl}
            width="100%"
            height={height}
            frameBorder="0"
            className="w-full"
            onLoad={() => setIsLoading(false)}
            style={{ minHeight: `${height}px` }}
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Data updates automatically • Last updated: {timestamp || 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  );
} 