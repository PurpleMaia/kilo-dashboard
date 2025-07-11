'use client'
import { Button } from "@/app/ui/button";
import { FileUp } from "lucide-react";
import { useState } from "react";

export default function ExportDataButton() {
    const [exporting, setExporting] = useState<boolean>(false)

    const handleExport = () => {
        try {
            setExporting(true)

            



        } catch {

        } finally {
            setExporting(false)
        }
    }        
    return (
        <>
            <Button variant={"outline"} className="bg-green-600 text-white font-bold bordershadow-md"   
                onClick={handleExport}             
            >
                <FileUp className="!w-6 !h-6"/> Export Data
            </Button>            
        </>
    )
}