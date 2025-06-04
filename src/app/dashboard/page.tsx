import { Suspense } from "react";
import PatchesWrapper from "../ui/patches/buttons";
import { PatchSkeleton } from "../ui/skeletons";

export default async function Page() {
    return (
        <main>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<PatchSkeleton />}>
                <PatchesWrapper />
            </Suspense>
            </div>
        </main>
    );
}