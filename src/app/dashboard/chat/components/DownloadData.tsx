'use client'
import { Button } from "@/app/ui/button";
import { Check, Download, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function DownloadDataButton() {
    const [downloading, setDownloading] = useState<boolean>(false)
    const [downloaded, setDownloaded] = useState<boolean>(false)

    useEffect(() => {
        const handleBeforeUnload = () => {
            setDownloaded(false);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setDownloaded(false);
            }
        };

        // add listeners to change downloaded state on window traversal or on page refresh
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const downloadFile = (content: string, filename: string, contentType: string) => {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);            
            const response = await fetch('/api/download');            
            if (!response.ok) {
                throw new Error('Download failed');
            }
            
            const downloadData = await response.json();
            const timestamp = new Date().toISOString().split('T')[0];
            
            // Download CSV file
            downloadFile(
                downloadData.sensorData,
                `sensor_data_${timestamp}.csv`,
                'text/csv'
            );
            
            // Download JSON file
            // downloadFile(
            //     downloadData.sampleTests,
            //     `sample_tests_${timestamp}.json`,
            //     'application/json'
            // );
            
            // Download PDF-like file
            // downloadFile(
            //     downloadData.sampleTestsPDF,
            //     `sample_tests_${timestamp}.txt`,
            //     'text/plain'
            // );
            
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download data');
        } finally {
            setDownloading(false);
            setDownloaded(true);
        }
    }        

    
    return (
        <>
            {downloaded ? (
                <div className="p-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm text-green-600">
                    <Check className="!w-6 !h-6" />
                    Downloaded
                </div>
            ) : (
                <Button
                    variant="outline"
                    className="bg-white border border-gray-400 text-gray-600 shadow-md inline-flex items-center gap-2"
                    onClick={handleDownload}
                    disabled={downloading}
                >
                    {downloading ? (
                        <>
                            <LoaderCircle className="!w-6 !h-6 animate-spin" />
                            Downloading...
                        </>
                    ) : (
                        <>
                            <Download className="!w-6 !h-6" />
                            Download Data
                        </>
                    )}
                </Button>
            )}
        </>
    )
}