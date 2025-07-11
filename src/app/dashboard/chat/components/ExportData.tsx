'use client'
import { Button } from "@/app/ui/button";
import { Check, FileUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function ExportDataButton() {
    const [exporting, setExporting] = useState<boolean>(false)
    const [exported, setExported] = useState<boolean>(false)

    useEffect(() => {
        const handleBeforeUnload = () => {
            setExported(false);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setExported(false);
            }
        };

        // add listeners to change exported state on window traversal or on page refresh
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

    const handleExport = async () => {
        try {
            setExporting(true);            
            const response = await fetch('/api/export');            
            if (!response.ok) {
                throw new Error('Export failed');
            }
            
            const exportData = await response.json();
            const timestamp = new Date().toISOString().split('T')[0];
            
            // Download CSV file
            downloadFile(
                exportData.sensorData,
                `sensor_data_${timestamp}.csv`,
                'text/csv'
            );
            
            // Download JSON file
            // downloadFile(
            //     exportData.sampleTests,
            //     `sample_tests_${timestamp}.json`,
            //     'application/json'
            // );
            
            // Download PDF-like file
            // downloadFile(
            //     exportData.sampleTestsPDF,
            //     `sample_tests_${timestamp}.txt`,
            //     'text/plain'
            // );
            
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export data');
        } finally {
            setExporting(false);
            setExported(true);
        }
    }        

    
    return (
        <>
            { exported ? (
                <div className=" p-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm text-green-600">
                    <Check className="!w-6 !h-6" />
                    Exported
                </div>
            ) : (            
                <Button 
                    variant={"outline"} 
                    className="bg-white border border-gray-400 text-gray-600 shadow-md"   
                    onClick={handleExport}
                    disabled={exporting}
                >          
                    <FileUp className="!w-6 !h-6" />
                    Export Data
                </Button>            
            )}
        </>
    )
}