import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card";
import { TriangleAlert, FileInput } from "lucide-react";
// import { db } from "../../../../db/kysely/client";

export default function SensorWidget() {
    const recentUploadData = {
        recent_sensor: "Soil Conductivity Handheld",
        time_difference: "3 Days since last upload",
        icon: TriangleAlert,
    }
    const Icon = recentUploadData.icon
    return (
        <>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-sm md:text-lg flex items-center gap-2">
                <FileInput className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                <span className="hidden sm:inline">Recent Upload</span>
                <span className="sm:hidden">Recent Upload</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 md:space-y-3">
                <div className="text-center">
                    <div className="flex gap-1 mb-1 md:mb-2 justify-center">
                        <p className="font-bold">Sensor: </p>
                        <div className="text-md mb-1 md:mb-2">{recentUploadData.recent_sensor}</div>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Icon />
                        <div className="font-semibold text-gray-900 text-xs md:text-sm">{recentUploadData.time_difference}</div>
                    </div>
                </div>                  
                </div>
            </CardContent>
        </Card>
        </>
    )
}