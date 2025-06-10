import { Suspense } from "react";
import { InvoiceSkeleton, RevenueChartSkeleton } from "../ui/skeletons";
import SensorsWrapper from "../ui/sensors/latest";
import GraphWrapper from "../ui/sensors/graph-serve";

export default async function Page() {
    return (
        <main>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<InvoiceSkeleton />}>
                    <SensorsWrapper />
                </Suspense>            
            </div>
            <br />            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <GraphWrapper />
                </Suspense>
            </div>            
        </main>
    );
}