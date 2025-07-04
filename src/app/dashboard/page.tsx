import { Suspense } from "react";
import { InvoiceSkeleton, RevenueChartSkeleton } from "../ui/skeletons";
import SensorsWrapper from "../components/sensors/latest";
import GraphWrapper from "../components/sensors/graph-serve";
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
                     
        </main>
    );
}