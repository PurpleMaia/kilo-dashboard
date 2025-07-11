'use client'
import { useParams } from "next/navigation";

export default function Page() {
    // const pathname = usePathname()
    const params = useParams()
    const patchName = params.name

    return (
        <>
            <div>
                a chart goes here for patch {patchName}
            </div>
        </>
    )
}