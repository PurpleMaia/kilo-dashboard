import { SensorGraph } from './graph';
import { fetchSensorsData } from '@/app/lib/data';

export default async function GraphWrapper() {
    const sensors = await fetchSensorsData()

    return (
        <>
            <div className="flex w-full flex-col md:col-span-4 h-full">
                <div className="overflow-y-auto h-full pr-2 space-y-6">
                    {sensors.map((sensor, i) => 
                        <div key={i} className="bg-white rounded-lg p-4 shadow-sm border">
                            <SensorGraph
                                name={sensor.name}
                                data={sensor.data}
                            >
                            </SensorGraph>
                        </div>
                    )}
                </div>
            </div>
        </>
    )

}