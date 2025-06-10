import { patches } from "@/app/lib/temp-data";
import Link from 'next/link';

export default function PatchesWrapper() {

    return (
        <>
            {patches.map((patch, i) => (
                <Patch
                    key={i}
                    num={i + 1}
                    name={patch.name}
                />
            ))}
        </>
    )
}

export function Patch({
    name,
    num,
}: {
    name: string;
    num: number;
}) {
    return (
        <Link                        
            href={`/dashboard/patch/${name}`}
        >
            <div className="hover:bg-sky-100 hover:text-blue-600 rounded-xl bg-gray-50 p-2 shadow-sm">
                <div className="flex p-4">
                    <h3 className="ml-2 text-sm font-medium">Patch {num}</h3>
                </div>
                <p
                    className={`
                    truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
                >
                    {name}
                </p>
            </div>
        </Link>
    )
}