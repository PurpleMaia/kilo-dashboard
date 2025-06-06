import { SensorGraph } from './graph';
import { fetchSensorsData } from '@/app/lib/data';


export default async function GraphWrapper() {
    const sensors = await fetchSensorsData()

    return (
        <>
            <div className="flex w-full flex-col md:col-span-4">

                <h2 className={`mb-4 text-xl md:text-2xl`}>
                    Trends
                </h2>
                                                       
                    {sensors.map((sensor, i) => 
                        <div key={i}>
                            <SensorGraph
                                name={sensor.name}
                                data={sensor.data}
                            >
                            </SensorGraph>
                        </div>
                    )}
            </div>
        </>
    )

}