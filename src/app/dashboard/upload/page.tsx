'use client'
import { DocumentTextIcon, ArrowUpTrayIcon, XMarkIcon, EyeIcon, EyeSlashIcon, ExclamationCircleIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";
import CsvEditor from "../../components/upload/CsvEditor";

interface SensorInfo {
  region?: string;
  location?: string;
  sensorID?: string;
}

interface CSVFile {
  file: File;
  id: string;
  data: Record<string, string>[];
  headers: string[];
  errors?: string[];
  sensorInfo?: SensorInfo;
}

export default function Upload() {
    const [files, setFiles] = useState<CSVFile[]>([])
    const [showPreview, setShowPreview] = useState<string | null>(null);
    const [editingFile, setEditingFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false)

    const handleFiles = async (selectedFiles: File[]) => {
        const csvFiles = selectedFiles.filter(file => 
        file.name.toLowerCase().endsWith('.csv')
        );

        if (csvFiles.length !== selectedFiles.length) {
        alert('Some files were skipped. Only CSV files are accepted.');
        }

        if (csvFiles.length === 0) return;
        
        // lightweight parsing text for preview, then check headers and prepare file package
        for (const file of csvFiles) {
            try {
                const text = await file.text();
                const lines = text.split('\n').filter(line => line.trim());
                const errors: string[] = []
                
                if (lines.length < 2) {
                    errors.push(`CSV file must contain at least a header row and one data row`);
                }

                const headers = lines.length > 0 ? lines[0].split(',').map(h => h.trim().toLowerCase()) : [];

                
                
                // check for required headers
                if (!headers.some(h => h.includes('time'))) {
                    errors.push(`Missing 'timestamp' column`);
                }
                if (!headers.some(h => h.includes('sensor'))) {
                    errors.push(`Missing 'Sensor ID' column`);
                }
                if (!headers.some(h => h.includes('location'))) {
                    errors.push(`Missing 'Location Name' column`);
                }
                if (!headers.some(h => h.includes('region'))) {
                    errors.push(`Missing 'Region Name' column`);
                }

                // Find the indices for region, location, sensor id
                const regionIdx = headers.findIndex(h => h.includes('region'));
                // const locationIdx = headers.findIndex(h => h.includes('location'));
                const sensorIdIdx = headers.findIndex(h => h.includes('sensor'));

                // Extract sensor info from the first data row (if available)
                const sensorInfo: SensorInfo = {};
                if (lines.length > 1) {
                    const firstData = lines[1].split(',').map(v => v.trim());
                    if (regionIdx !== -1) sensorInfo.region = firstData[regionIdx] || '';
                    // if (locationIdx !== -1) sensorInfo.location = firstData[locationIdx] || '';
                    if (sensorIdIdx !== -1) sensorInfo.sensorID = firstData[sensorIdIdx] || '';
                }

                // exclude region, location, and any 'id' headers from final data obj
                const dataHeaders = headers.filter(h => {
                    const normalized = h.replace(/\s+/g, '').toLowerCase();
                    if (normalized.endsWith('id')) return false;
                    // if (normalized.includes('location')) return false;
                    if (normalized.includes('region')) return false;
                    return true;
                });
                // only grab data within the dataHeaders
                const data = lines.map((line) => {
                    const values = line.split(',').map(v => v.trim());
                    const row: Record<string, string> = {};
                    dataHeaders.forEach((header) => {
                        const idx = headers.indexOf(header);
                        row[header] = values[idx] || '';
                    });
                    return row;
                });
                console.log('all headers', headers)
                console.log('exported headers',dataHeaders)

                const newFile: CSVFile = {
                    file,
                    id: Math.random().toString(36).substr(2, 9),
                    data: data,
                    headers: dataHeaders,
                    errors: errors.length > 0 ? errors : undefined,
                    sensorInfo: sensorInfo
                };

                setFiles(prev => [...prev, newFile]);
            } catch (error) {
                setFiles(prev => [...prev, {
                            file,
                            id: Math.random().toString(36).substr(2, 9),
                            data: [],
                            headers: [],
                            errors: [`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`],
                            sensorInfo: {}
                }]);           
            }
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            handleFiles(selectedFiles);
        }
    };

    // set the file container to be without the fileID passed
    const removeFile = (fileID: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileID))
    }

    const clearAllFiles = () => {
        setFiles([])
        
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // prepare package to api route (already parsed the data, just put it to server for more parsing)
    const handleUploadAll = async () => {
        setLoading(true)
        try {                    
            // Prepare the data to send
            const uploadData = files.map(file => ({
                fileName: file.file.name,                
                data: file.data, // This contains the parsed CSV data
                headers: file.headers,
                sensorInfo: file.sensorInfo
            }));
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadData)
                });

                const result = await response.json();

                if (response.ok) {
                // Show success message
                alert(`Upload completed!\n${result.summary.successfulFiles} files processed successfully.\n${result.summary.failedFiles} files failed.`);
                console.log(result.result)
                // Clear files after successful upload
                setFiles([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                } else {
                // Show error message
                alert(`Upload failed: ${result.error}`);
                }

        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setLoading(false)
        }
        
        // Clear files after successful upload
        setFiles([]);
    };

    const handleDataEdit = (fileId: string, newData: Record<string, string>[], newHeaders: string[]) => {
        // Re-validate the edited data
        const errors: string[] = [];
        
        if (newData.length < 2) {
            errors.push('CSV file must contain at least a header row and one data row');
        }

        const headerNames = newHeaders.map(h => h.toLowerCase());
        
        // Check for required headers
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

        setFiles(prev => prev.map(f => 
            f.id === fileId 
                ? { 
                    ...f, 
                    data: newData, 
                    headers: newHeaders,
                    errors: errors.length > 0 ? errors : undefined
                }
                : f
        ));
    };

    return (
        <>
        <div className="p-4 space-y-6">

            {/* Upload Area */}
            <div className={`border-2 border-dashed rounded-lg p-6 transition-colors`}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    multiple
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="text-center">                
                    <div className="space-y-2">
                    <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Click to upload</span>
                    </div>
                    <p className="text-xs text-gray-500">Multiple CSV files supported</p>
                    </div>                
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Uploaded Files</h3>
                    <button
                    onClick={clearAllFiles}
                    className="text-sm text-red-600 hover:text-red-800"
                    >
                    Clear All
                    </button>
                </div>

                <div className="space-y-3">
                    {files.map((csvFile) => (
                    <div key={csvFile.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                            <DocumentTextIcon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                            <p className="font-medium text-gray-900">{csvFile.file.name}</p>
                            <p className="text-sm text-gray-500">
                                {(csvFile.file.size / 1024).toFixed(1)} KB • {csvFile.data.length} rows
                            </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button
                            onClick={() => setEditingFile(csvFile.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100"
                            title="Edit CSV data"
                            >
                            <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                            onClick={() => setShowPreview(showPreview === csvFile.id ? null : csvFile.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                            title="Toggle preview"
                            >
                            {showPreview === csvFile.id ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                            </button>
                            <button
                            onClick={() => removeFile(csvFile.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"
                            title="Remove file"
                            >
                            <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>                        
                    </div>                                            

                        {/* Validation Status */}
                        <div className="flex items-center space-x-2 text-sm">     
                            {csvFile.errors && csvFile.errors.length > 0 ? (
                                <div className="flex flex-col text-red-600">
                                <div className="flex items-center">
                                    <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                                    <span>FILE HAS ERRORS:</span>
                                </div>
                                <ul className="ml-4 list-disc">
                                    {csvFile.errors.map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                    ))}
                                </ul>
                                </div>
                            ) : (
                                <div className="flex items-center text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Ready for upload
                                </div>
                            )}                                                                                    
                        </div>

                        {/* Preview Data */}
                        {showPreview === csvFile.id && (
                        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700">Data Preview - First 5 rows</h4>
                            </div>
                            <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    {Object.keys(csvFile.data[0] || {}).filter(key => key !== '_row').map((header) => (
                                    <th
                                        key={header}
                                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {csvFile.data.slice(0, 5).map((row, index) => (
                                    <tr key={index}>
                                    {Object.entries(row).filter(([key]) => key !== '_row').map(([key, value]) => (
                                        <td key={key} className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                        {String(value)}
                                        </td>
                                    ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                        )}
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Upload Button */}
            {files.length > 0 && (
                <div className="flex justify-end space-x-3">
                <button
                    onClick={clearAllFiles}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Cancel
                </button>
                {loading ? (
                    <button
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md"
                    >
                        Loading...
                    </button>
                ) : (

                    <button
                        onClick={handleUploadAll}
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                        Process Files
                    </button>
                )}
                </div>
            )}

            {/* CSV Editor Modal */}
            {editingFile && (() => {
                const file = files.find(f => f.id === editingFile);
                if (!file) return null;
                
                return (
                    <CsvEditor
                        data={file.data}
                        headers={file.headers}
                        onDataChange={(newData, newHeaders) => handleDataEdit(editingFile, newData, newHeaders)}
                        onClose={() => setEditingFile(null)}
                    />
                );
            })()}
        </div>
        </>
    )
}