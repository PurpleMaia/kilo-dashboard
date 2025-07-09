'use client'
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { MalaGraph } from './MalaGraph';

interface MetricData {
    [metricType: string]: Array<{ timestamp: string; value: number }>;
}

interface Mala {
    name: string;
    data: MetricData;
}

interface LocationWidgetProps {
    locations: Mala[];
}

export default function LocationWidget({ locations }: LocationWidgetProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextLocation = () => {
        setCurrentIndex((prev) => (prev + 1) % locations.length);
    };

    const prevLocation = () => {
        setCurrentIndex((prev) => (prev - 1 + locations.length) % locations.length);
    };

    if (locations.length === 0) return <div className="text-center py-4">No locations found</div>;

    const currentLocation = locations[currentIndex];

    return (
        <>
            <div className="w-full h-full">
                <div className="bg-white rounded-lg p-4 shadow-sm border h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {currentLocation.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevLocation}
                                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={locations.length <= 1}
                                aria-label="Previous sensor"
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                            </button>
                            <span className="text-sm text-gray-600 min-w-[60px] text-center">
                                {currentIndex + 1} / {locations.length}
                            </span>
                            <button
                                onClick={nextLocation}
                                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={locations.length <= 1}
                                aria-label="Next sensor"
                            >
                                <ChevronRightIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>                                                    
                    
                    <div className="flex-1 min-h-0">
                        <MalaGraph data={currentLocation.data} />
                    </div>
                </div>
            </div>
        </>
    )

}