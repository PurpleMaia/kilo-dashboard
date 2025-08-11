import React, { useState, useRef, useEffect } from 'react';
import { CheckIcon, XMarkIcon, TrashIcon, PlusIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface CsvEditorProps {
  data: Record<string, string>[];
  headers: string[];
  onDataChange: (data: Record<string, string>[], headers: string[]) => void;
  onClose: () => void;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export default function CsvEditor({ data: initialData, headers: initialHeaders, onDataChange, onClose }: CsvEditorProps) {
  const [data, setData] = useState(initialData);
  const [headers, setHeaders] = useState(initialHeaders);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddRow, setShowAddRow] = useState(false);
  const [newRowData, setNewRowData] = useState<string[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [showFormatRequirements, setShowFormatRequirements] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize new row data
  useEffect(() => {
    setNewRowData(new Array(headers.length).fill(''));
  }, [headers]);

  // Focus input when editing
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const validateCsv = (): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if we have data
    if (data.length < 2) {
      errors.push('CSV must contain at least a header row and one data row');
    }

    // Check required headers
    const headerNames = headers.map(h => h.toLowerCase());
    
    if (!headerNames.some(h => h.includes('time'))) {
      errors.push('Missing required column: timestamp (or time)');
    }
    if (!headerNames.some(h => h.includes('sensor'))) {
      errors.push('Missing required column: sensor id');
    }
    if (!headerNames.some(h => h.includes('location'))) {
      errors.push('Missing required column: location name');
    }
    if (!headerNames.some(h => h.includes('region'))) {
      errors.push('Missing required column: region name');
    }

    // Check for metric columns format (category_metric_unit)
    const metricColumns = headers.filter(h => 
      !h.toLowerCase().includes('time') && 
      !h.toLowerCase().includes('sensor') && 
      !h.toLowerCase().includes('location') && 
      !h.toLowerCase().includes('region')
    );

    metricColumns.forEach(column => {
      const parts = column.split('_');
      if (parts.length < 2) {
        warnings.push(`Column "${column}" doesn't follow the recommended format: category_metric_unit`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleValidate = () => {
    const result = validateCsv();
    setValidationResult(result);
    setShowValidation(true);
  };

  const handleCellClick = (row: number, col: number, value: string) => {
    setEditingCell({ row, col });
    setEditValue(value);
  };

  const handleCellEdit = (value: string) => {
    setEditValue(value);
  };

  const saveCellEdit = () => {
    if (!editingCell) return;

    const newData = [...data];
    const headerKey = headers[editingCell.col];
    
    if (editingCell.row >= 0 && editingCell.row < newData.length) {
      newData[editingCell.row] = { ...newData[editingCell.row], [headerKey]: editValue };
      setData(newData);
    }
    
    setEditingCell(null);
    setEditValue('');
  };

  const cancelCellEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleHeaderEdit = (colIndex: number, newHeader: string) => {
    const newHeaders = [...headers];
    newHeaders[colIndex] = newHeader;
    setHeaders(newHeaders);
    
    // Update data to use new header key
    const newData = data.map(row => {
      const newRow = { ...row };
      const oldKey = headers[colIndex];
      if (oldKey in newRow) {
        newRow[newHeader] = newRow[oldKey];
        delete newRow[oldKey];
      }
      return newRow;
    });
    setData(newData);
  };

  const moveColumn = (colIndex: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? colIndex - 1 : colIndex + 1;
    if (newIndex < 0 || newIndex >= headers.length) return;

    const newHeaders = [...headers];
    [newHeaders[colIndex], newHeaders[newIndex]] = [newHeaders[newIndex], newHeaders[colIndex]];
    setHeaders(newHeaders);
  };

  const addColumn = () => {
    const newHeader = `Column${headers.length + 1}`;
    setHeaders([...headers, newHeader]);
    setNewRowData([...newRowData, '']);
    
    // Add empty values to all existing rows
    const newData = data.map(row => ({ ...row, [newHeader]: '' }));
    setData(newData);
  };

  const removeColumn = (colIndex: number) => {
    const newHeaders = headers.filter((_, i) => i !== colIndex);
    setHeaders(newHeaders);
    
    // Remove column from all rows
    const headerToRemove = headers[colIndex];
    const newData = data.map(row => {
      const newRow = { ...row };
      delete newRow[headerToRemove];
      return newRow;
    });
    setData(newData);
    
    // Update new row data
    const newNewRowData = newRowData.filter((_, i) => i !== colIndex);
    setNewRowData(newNewRowData);
  };

  const addRow = () => {
    const newRow: Record<string, string> = {};
    headers.forEach((header, index) => {
      newRow[header] = newRowData[index] || '';
    });
    
    setData([...data, newRow]);
    setNewRowData(new Array(headers.length).fill(''));
    setShowAddRow(false);
  };

  const removeRow = (rowIndex: number) => {
    setData(data.filter((_, i) => i !== rowIndex));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveCellEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelCellEdit();
    }
  };

  const saveChanges = () => {
    onDataChange(data, headers);
    onClose();
  };

  const getCellValue = (row: Record<string, string>, header: string) => {
    return row[header] || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Edit CSV Data</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleValidate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              Validate CSV
            </button>
            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>

        {/* CSV Format Requirements and Validation Status */}
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-2 gap-6">
            {/* CSV Format Requirements - Left Side */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blue-800">CSV Format Requirements</h3>
                <button
                  onClick={() => setShowFormatRequirements(!showFormatRequirements)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showFormatRequirements ? 'Hide details' : 'Show details'}
                </button>
              </div>
              {showFormatRequirements && (
                <div className="text-sm text-blue-700 space-y-2">
                  <p>Your CSV file should have columns in this format:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><code>(category)_(metric)_(unit)</code></li>
                  </ul>
                  <p>For example:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><code>water_pH_m</code></li>
                    <li><code>soil_phosphorous_m</code></li>
                  </ul>
                  <p>Your CSV needs these columns:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><code>Timestamp</code></li>
                    <li><code>Sensor ID</code></li>
                    <li><code>Location Name</code></li>
                    <li><code>Region Name</code></li>
                  </ul>
                </div>
              )}
            </div>

            {/* CSV Validation Status - Right Side */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-800">CSV Validation Status</h3>
                {(validationResult && validationResult.errors && validationResult.errors.length > 0 ||
                  validationResult && validationResult.warnings && validationResult.warnings.length > 0) && (
                  <button
                    onClick={() => setShowValidation(!showValidation)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    {showValidation ? 'Hide details' : 'Show details'}
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-700">
                {validationResult ? (
                  <div className="space-y-2">
                    <div className={`flex items-center ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {validationResult.isValid ? (
                        <CheckIcon className="h-4 w-4 mr-2" />
                      ) : (
                        <ExclamationCircleIcon className="h-4 w-4 mr-2" />
                      )}
                      <span className="font-medium">
                        {validationResult.isValid ? 'Validation Passed' : 'Validation Failed'}
                      </span>
                    </div>
                    {validationResult.errors.length > 0 && (
                      <div>
                        <span className="font-medium text-red-600">Errors: {validationResult.errors.length}</span>
                      </div>
                    )}
                    {validationResult.warnings.length > 0 && (
                      <div>
                        <span className="font-medium text-yellow-600">Warnings: {validationResult.warnings.length}</span>
                      </div>
                    )}
                    
                    {/* Detailed Results */}
                    {showValidation && (validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        {validationResult.errors.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-red-800 mb-1">Errors:</h4>
                            <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                              {validationResult.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {validationResult.warnings.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-yellow-800 mb-1">Warnings:</h4>
                            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                              {validationResult.warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Click &quot;Validate CSV&quot; to check your data
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <button
              onClick={addColumn}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Column
            </button>
            <button
              onClick={() => setShowAddRow(true)}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Row
            </button>
            <span className="text-sm text-gray-600">
              {data.length} rows × {headers.length} columns
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto touch-pan-y">
          <div className="min-w-full">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border border-gray-300 p-2 text-sm font-medium text-gray-700 w-16">
                    #
                  </th>
                  {headers.map((header, colIndex) => (
                    <th key={colIndex} className="border border-gray-300 p-2 text-sm font-medium text-gray-700 min-w-32">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => moveColumn(colIndex, 'left')}
                            disabled={colIndex === 0}
                            className="text-gray-400 hover:text-blue-600 disabled:text-gray-200 disabled:cursor-not-allowed"
                            title="Move left"
                          >
                            ←
                          </button>
                          <input
                            value={header}
                            onChange={(e) => handleHeaderEdit(colIndex, e.target.value)}
                            className="border-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                          />
                          <button
                            onClick={() => moveColumn(colIndex, 'right')}
                            disabled={colIndex === headers.length - 1}
                            className="text-gray-400 hover:text-blue-600 disabled:text-gray-200 disabled:cursor-not-allowed"
                            title="Move right"
                          >
                            →
                          </button>
                        </div>
                        <button
                          onClick={() => removeColumn(colIndex)}
                          className="text-red-500 hover:text-red-700 ml-2"
                          title="Remove column"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="border border-gray-300 p-2 text-sm font-medium text-gray-700 w-16">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-sm text-gray-500 text-center">
                      {rowIndex + 1}
                    </td>
                    {headers.map((header, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2 text-sm">
                        {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                          <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => handleCellEdit(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={saveCellEdit}
                            className="w-full border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                          />
                        ) : (
                          <div
                            onClick={() => handleCellClick(rowIndex, colIndex, getCellValue(row, header))}
                            className="cursor-pointer hover:bg-blue-50 px-1 py-1 rounded min-h-[20px] flex items-center"
                          >
                            {getCellValue(row, header)}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove row"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {/* Add Row Form */}
                {showAddRow && (
                  <tr className="bg-blue-50">
                    <td className="border border-gray-300 p-2 text-sm text-gray-500 text-center">
                      New
                    </td>
                    {headers.map((header, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2 text-sm">
                        <input
                          value={newRowData[colIndex] || ''}
                          onChange={(e) => {
                            const newData = [...newRowData];
                            newData[colIndex] = e.target.value;
                            setNewRowData(newData);
                          }}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder={`Enter ${header}`}
                        />
                      </td>
                    ))}
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={addRow}
                          className="text-green-600 hover:text-green-800"
                          title="Add row"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowAddRow(false)}
                          className="text-red-600 hover:text-red-800"
                          title="Cancel"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 