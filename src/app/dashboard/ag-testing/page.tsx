'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { ArrowUpTrayIcon, CalendarIcon, DocumentChartBarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface AgTestFile {
  id: number;
  test_type: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export default function AgTesting() {
  const [typeName, setTypeName] = useState('')  
  const [title, setTitle] = useState('')  
  const [files, setFiles] = useState<AgTestFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<AgTestFile | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/ag-tests`);
      const data = await response.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  const recentTests = [
    {
      id: "test-001",
      type: "E. coli Test",
      location: "Water Source - Main Well",
      date: "2024-07-02",
      status: "normal"
    },
    {
      id: "test-002", 
      type: "Soil Test",
      location: "North Field - Section A",
      date: "2024-07-01",
      status: "low"
    },
    {
      id: "test-003",
      type: "Water Quality Test",
      location: "East Irrigation Line",
      date: "2024-06-30",
      status: "normal"
    }
  ];

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "normal": return "bg-green-100 text-green-800";
  //     case "low": return "bg-yellow-100 text-yellow-800";
  //     case "high": return "bg-red-100 text-red-800";
  //     default: return "bg-gray-100 text-gray-800";
  //   }
  // };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    if (file && file.type === 'application/pdf') {
      console.log('PDF uploaded:', file.name);
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('testType', typeName);
        formData.append('title', title)

        const response = await fetch('/api/ag-test-upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          await fetchFiles(); // Refresh the file list
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Error parsing PDF:', error);
        console.log('PDF parsing failed - please fill fields manually');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFilePreview = (file: AgTestFile) => {
    if (file.mime_type === 'application/pdf') {
      setPreviewFile(file);
    } else {
      // For non-PDF files, download them
      window.open(`/api/ag-test-upload/${file.id}`, '_blank');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="p-6 space-y-6">
        {/* Quick Test Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DocumentChartBarIcon className="h-5 w-5 text-blue-600" />
              Upload Sample Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* PDF Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <DocumentChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Upload PDF test results
                  </p>
                  <p className="text-xs text-gray-500">
                    Click to browse or drag and drop
                  </p>
                  {isUploading && (
                    <p className="text-xs text-blue-600 mt-2">
                      Uploading PDF data...
                    </p>
                  )}
                </label>
              </div>
              
              {/* Location and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="testName">Test Name</label>
                  <input 
                    id="testName" 
                    type="text" 
                    placeholder="e.g., Spring 2024 Soil Analysis"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="testName">Sample Type</label>
                  <select id="testType" className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select test type</option>
                    <option value="soil">Soil Test</option>
                    <option value="water">Water Quality Test</option>
                    <option value="ecoli">E. coli Test</option>
                    <option value="nutrient">Nutrient Analysis</option>
                    <option value="pesticide">Pesticide Residue Test</option>
                    <option value="heavy-metal">Heavy Metal Test</option>
                  </select>
                </div>
              </div>            
            </div>
            
            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-2 bg-black text-white text-sm rounded p-2 hover:bg-gray-800">
                <ArrowUpTrayIcon className="h-4 w-4" />
                Process Test Results
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-green-600" />
              Recent Samples Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{test.type}</h3>
                        
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {test.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {test.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
