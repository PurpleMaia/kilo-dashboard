'use client';

import { useState, useEffect, useCallback } from 'react';
import { DocumentArrowUpIcon, DocumentTextIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import PdfPreview from '@/app/dashboard/ag-testing/components/PdfPreview';

interface AgTestFile {
  id: number;
  test_type: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  description?: string;
}

interface AgTestCardProps {
  type: 'water' | 'soil' | 'ecoli';
  title: string;
}

export default function AgTestCard({ type, title }: AgTestCardProps) {
  const [files, setFiles] = useState<AgTestFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState<AgTestFile | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch(`/api/ag-test-upload?type=${type}`);
      const data = await response.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  }, [type]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('testType', type);
      formData.append('description', `${title} test report`);

      const response = await fetch('/api/ag-test-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchFiles(); // Refresh the file list
        setUploadProgress(100);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleFileDelete = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/ag-test-upload/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchFiles(); // Refresh the file list
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  const handleFilePreview = (file: AgTestFile) => {
    if (file.mime_type === 'application/pdf') {
      setPreviewFile(file);
    } else {
      // For non-PDF files, download them
      window.open(`/api/ag-test-upload/${file.id}`, '_blank');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <DocumentTextIcon className="h-5 w-5 text-red-600 flex-shrink-0" />;
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return <DocumentTextIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />;
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return <DocumentTextIcon className="h-5 w-5 text-green-600 flex-shrink-0" />;
    } else {
      return <DocumentTextIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <div className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700">
              <DocumentArrowUpIcon className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload File'}
            </div>
          </label>
        </div>

        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No files uploaded yet</p>
              <p className="text-sm">Upload a {type} test report to get started</p>
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.mime_type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.file_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.file_size)} • {formatDate(file.uploaded_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFilePreview(file)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <EyeIcon className="h-4 w-4" />
                    {file.mime_type === 'application/pdf' ? 'Preview' : 'Download'}
                  </button>
                  <button
                    onClick={() => handleFileDelete(file.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PDF Preview Modal */}
      {previewFile && (
        <PdfPreview
          fileId={previewFile.id}
          fileName={previewFile.file_name}
          isOpen={true}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </>
  );
}