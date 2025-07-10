import { Button } from "@/app/ui/button";
import { FileUp } from "lucide-react";

export default function ExportDataButton() {

    
    return (
        <>
            <Button variant={"outline"} className="bg-green-600 text-white font-bold bordershadow-md"
                
            >
                <FileUp className="!w-6 !h-6"/> Export Data
            </Button>
        </>
    )
}