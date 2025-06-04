'use client'
import { usePathname, useSearchParams } from "next/navigation";

export default function Page() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const patchName = searchParams.get('name')

    return (
        <>
            <div>
                a chart goes here for patch {patchName}
            </div>
        </>
    )
}