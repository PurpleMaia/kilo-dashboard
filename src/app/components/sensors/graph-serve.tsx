import { SensorGraph } from './graph';
import { fetchSensorsData } from '@/app/lib/data';

export default async function GraphWrapper() {
    const sensors = await fetchSensorsData()

    return (
        <>
            <div className="flex w-full flex-col md:col-span-4 h-full">
                <div className="overflow-y-auto h-full pr-2 space-y-6 touch-pan-y">
                    {sensors.map((sensor, i) => 
                        <div key={i} className="bg-white rounded-lg p-4 shadow-sm border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {sensor.name}
                            </h3>
                            <SensorGraph
                                data={sensor.data}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )

}