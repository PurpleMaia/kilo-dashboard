import { fetchLatestSensorsData } from "@/app/lib/data";
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from "clsx";

export default async function SensorsWrapper() {
    const sensors = await fetchLatestSensorsData();

    return (
        <>
            <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`mb-4 font-black text-xl md:text-2xl`}>
        Latest Data
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">

        <div className="bg-white px-6">
          {sensors.map((sensor, i) => {
            return (
              <div
                key={i}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">                  
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {sensor.name}
                    </p>                    
                  </div>
                </div>
                <p
                  className={`truncate text-sm font-medium md:text-base`}
                >
                  {sensor.value}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
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