'use client'
import { ExclamationTriangleIcon, CheckCircleIcon, TrashIcon, DocumentTextIcon, ArrowUpTrayIcon, XMarkIcon, MapPinIcon, EyeIcon, EyeSlashIcon, CpuChipIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";

interface CSVFile {
  file: File;
  id: string;
  data: any[];
  headers: any[];
  landID: string;
  sensorID: string;
}

export default function Upload() {
    const [files, setFiles] = useState<CSVFile[]>([])
    const [showPreview, setShowPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // const availableLands = await fetchLands()
    const availableLands = [
        { id: '1', name: 'North Farm' },
        { id: '2', name: 'South Pasture' },
        { id: '3', name: 'Greenhouse Complex' } 
    ]
    // const availableSensors = await fetchSensors()
    const availableSensors = [
        { id: 'KILO-001', name: 'Sensor A1-01' },
        { id: 'KILO-002', name: 'Sensor A1-02' },
        { id: 'KILO-003', name: 'Sensor A2-01' },
        { id: 'KILO-004', name: 'Sensor B1-01' },
        { id: 'KILO-005', name: 'Sensor GH1-01' },
        { id: 'KILO-006', name: 'Sensor GH2-01' },
        { id: 'KILO-007', name: 'Sensor A1-03' },
        { id: 'KILO-008', name: 'Sensor A2-02' }
    ];

    const handleFiles = async (selectedFiles: File[]) => {
        const csvFiles = selectedFiles.filter(file => 
        file.name.toLowerCase().endsWith('.csv')
        );

        if (csvFiles.length !== selectedFiles.length) {
        alert('Some files were skipped. Only CSV files are accepted.');
        }

        if (csvFiles.length === 0) return;
        
        // parsing text for preview, prepare package, check headers
        for (const file of csvFiles) {
            try {
                const text = await file.text();
                const lines = text.split('\n').filter(line => line.trim());
                
                if (lines.length < 2) {
                    alert(`${file.name}: CSV file must contain at least a header row and one data row`);
                    continue;
                }

                const headers = lines[0].split(',').map(h => h.trim());
                
                const data = lines.slice(1).map((line, index) => {
                const values = line.split(',').map(v => v.trim());
                const row: any = { _row: index + 2 };
                headers.forEach((header, i) => {
                        row[header] = values[i] || '';
                    });
                    return row;
                });

                // TODO add a checker to see if headers contain "timestamp" equivalent (can be push into more detail)
                //     if (metricParts.length < 3) {
                //     // TODO check this on client-side
                //     continue;
                // }
                const newFile: CSVFile = {
                    file,
                    id: Math.random().toString(36).substr(2, 9),
                    data: data,
                    headers: headers,
                    landID: '',
                    sensorID: ''
                };

                setFiles(prev => [...prev, newFile]);
            } catch (error) {
                alert(`Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };

    const updateFileMetadata = (fileId: string, field: 'landID' | 'sensorID', value: string) => {
        setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, [field]: value } : f
        ));
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
        try {                    
            // Prepare the data to send
            const uploadData = files.map(file => ({
                fileName: file.file.name,
                landID: file.landID,
                sensorID: file.sensorID,
                data: file.data, // This contains the parsed CSV data
                headers: file.headers
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
            }
        
        // Clear files after successful upload
        setFiles([]);
    };

    return (
        <>
        <div className="space-y-6">

            {/* Upload Area */}
            <div className={`relative border-2 border-dashed rounded-lg p-6 transition-colors`}>
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
                        <span className="font-medium">Click to upload</span> or drag and drop
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
                            <div className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Ready for upload
                            </div>                                                                    
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

            {/* File Format Guidelines */}
            <div className="bg-lime-50 border border-lime-600 rounded-md p-4">
                <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-lime-900 mt-0.5" />
                <div className="ml-3">
                    <h3 className="text-sm font-bold text-lime-900">CSV Format Requirements</h3>
                    <div className="mt-2 text-sm text-lime-900">
                    <p>Your CSV file should have columns in this format:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                        <li><code>(category)_(metric)_(unit)</code></li>
                    </ul>
                    <br />
                    <p>For example:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                        <li><code>water_pH_m</code></li>
                        <li><code>soil_phosphorous_m</code></li>
                    </ul>
                    <br />
                    <p>Your CSV needs to have a timestamp column</p>
                    </div>
                </div>
                </div>
            </div>

            {/* Upload Button */}
            {files.length > 0 && (
                <div className="flex justify-end space-x-3">
                <button
                    onClick={clearAllFiles}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Cancel
                </button>
                <button
                    onClick={handleUploadAll}
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                    Process Files
                </button>
                </div>
            )}
        </div>
        </>
    )
}