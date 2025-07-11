'use client'

import { useState } from "react";
import LatestFetch from "@/app/components/sensors/latest";
import { Button } from "@/app/ui/button";
import { LayoutGrid } from "lucide-react";
import { SensorGrid } from "@/app/components/sensors/SensorGrid";

export default function Sensors() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  return (
    <div className="min-h-screen p-4">
      
      <div className="space-y-6">
        {/* Recent Data Fetch Status */}
        <LatestFetch />
        
        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Sensor Readings</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "outline" : "default"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Cards
            </Button>
            {/* <Button
              variant={viewMode === "table" ? "outline" : "default"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="flex items-center gap-2"
            >
              <Table className="h-4 w-4" />
              Table
            </Button> */}
          </div>
        </div>
        
        {/* Sensor Data Display */}
        <SensorGrid />
        {/* {viewMode === "grid" ? <SensorGrid /> : <SensorTable />} */}
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