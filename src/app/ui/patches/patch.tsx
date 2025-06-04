import { fetchPatches } from "@/app/lib/data";

export default function PatchesWrapper() {
    const { patches } = fetchPatches();

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
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
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
    )
}