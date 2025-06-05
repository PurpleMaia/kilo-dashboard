import { Suspense } from "react";
import PatchesWrapper from "../ui/patches/buttons";
import { PatchSkeleton } from "../ui/skeletons";
import SensorsWrapper from "../ui/sensors/latest";

export default async function Page() {
    return (
        <main>
            Patches
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<PatchSkeleton />}>
                <PatchesWrapper />
            </Suspense>
            </div>
            <br></br>            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<PatchSkeleton />}>
                <SensorsWrapper />
            </Suspense>
            </div>
        </main>
    );
}