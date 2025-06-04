'use client'
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { fetchSensors } from "@/app/lib/data";

export default function SensorsWrapper() {
    const sensors = fetchSensors();

    return (
        <>
            {sensors.map((sensor, i) => (
                <Sensor
                    key={i}
                    type={sensor.type}
                    value={sensor.latestMeasurement}
                />
            ))}
        </>
    )
}

export function Sensor({
    type,
    value,
}: {
    type: string;
    value: number;
}) {
    const searchParams = useSearchParams()
    const pathname = usePathname();
    const { replace } = useRouter();
    
    // const handleClick = () => {
    //     console.log(`Redirecting to... ${name}`)
    //     const params = new URLSearchParams(searchParams)
    //     params.set('name', name)
    //     replace(`${pathname}/patch?${params.toString()}`)
    // }

    return (        
            <div className="hover:bg-sky-100 hover:text-blue-600 rounded-xl bg-gray-50 p-2 shadow-sm">
                <div className="flex p-4">
                    <h3 className="ml-2 text-sm font-medium">{type}</h3>
                </div>
                <p
                    className={`
                    truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
                >
                    {value}
                </p>
            </div>
    )
}