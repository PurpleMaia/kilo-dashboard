'use client'
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SensorGraph } from '../sensors/graph';

interface MalaData {
    [malaName: string]: Array<{ timestamp: string; value: number }>;
}

interface Sensor {
    name: string;
    data: MalaData;
}

interface SensorReadingsProps {
    sensors: Sensor[];
}

export default function SensorReadings({ sensors }: SensorReadingsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSensor = () => {
        setCurrentIndex((prev) => (prev + 1) % sensors.length);
    };

    const prevSensor = () => {
        setCurrentIndex((prev) => (prev - 1 + sensors.length) % sensors.length);
    };

    if (sensors.length === 0) return <div className="text-center py-4">No sensors found</div>;

    const currentSensor = sensors[currentIndex];

    return (
        <>
            <div className="w-full h-full">
                <div className="bg-white rounded-lg p-4 shadow-sm border h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {currentSensor.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevSensor}
                                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={sensors.length <= 1}
                                aria-label="Previous sensor"
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                            </button>
                            <span className="text-sm text-gray-600 min-w-[60px] text-center">
                                {currentIndex + 1} / {sensors.length}
                            </span>
                            <button
                                onClick={nextSensor}
                                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={sensors.length <= 1}
                                aria-label="Next sensor"
                            >
                                <ChevronRightIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>                                                    
                    
                    <div className="flex-1 min-h-0">
                        <SensorGraph
                            data={currentSensor.data}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}