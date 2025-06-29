import { Suspense } from "react";
import { InvoiceSkeleton, RevenueChartSkeleton } from "../ui/skeletons";
import SensorsWrapper from "../ui/sensors/latest";
import GraphWrapper from "../ui/sensors/graph-serve";
import { cookies } from "next/headers";


export default async function Page() {
    const sessionCookie = (await cookies()).get('auth_session');
    return (
        <main>
            {/* Patches
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<PatchSkeleton />}>
                <PatchesWrapper />
            </Suspense>
            </div> */}
            <p>{sessionCookie?.name}</p>
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