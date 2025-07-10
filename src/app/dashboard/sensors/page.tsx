// import { SensorGrid } from "@/app/components/sensors/graph";
// import { SensorHealth } from "@/components/SensorHealth";
// import { RecentDataFetch } from "@/components/RecentDataFetch";
import { Suspense } from "react";
import { InvoiceSkeleton } from "@/app/ui/skeletons";
import LatestFetch from "@/app/components/sensors/latest";

export default function Sensors() {
  return (
    <div className="min-h-screen p-4">
      
      <div className="space-y-6">
        {/* Recent Data Fetch Status */}
        <Suspense fallback={<InvoiceSkeleton />}>
            <LatestFetch />
        </Suspense>   
        
        {/* Sensor Health Overview */}
        {/* <SensorHealth /> */}
        
        {/* Live Sensor Data Grid */}
        {/* <SensorGrid /> */}
      </div>
    </div>
  );
}

{/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<InvoiceSkeleton />}>
                    <SensorsWrapper />
                </Suspense>            
            </div>
            <br />            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <GraphWrapper />
                </Suspense>
            </div>    */}