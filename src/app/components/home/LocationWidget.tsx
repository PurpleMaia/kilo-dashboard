'use client'
import { useState, useEffect } from 'react';
import { MalaGraph } from './MalaGraph';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import useScreenSize from '@/app/lib/hooks';

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
    const [isMobile, setIsMobile] = useState(false);
    const screenSize = useScreenSize();

    useEffect(() => {
        setIsMobile(screenSize.width < 768);
    }, [screenSize.width]);

    if (locations.length === 0) return <div className="text-center py-4">No locations found</div>;

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 shadow-md">
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={!isMobile}
                    pagination={{
                        clickable: true,
                        el: '.swiper-pagination-custom',
                        bulletClass: 'swiper-pagination-bullet',
                        bulletActiveClass: 'swiper-pagination-bullet-active',
                    }}
                    modules={[Navigation, Pagination]}
                    className="h-full"                
                >
                    {locations.map((location, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {location.name}
                                    </h3>
                                    {isMobile ? (
                                        <p></p>
                                    ) : (
                                        <div className="text-sm text-gray-600">
                                            {index + 1} / {locations.length}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-h-0">
                                    <MalaGraph data={location.data} />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            
            {/* Custom pagination at the bottom */}
            <div className="swiper-pagination-custom flex justify-center items-center py-2 bg-gray-50 rounded-b-lg"></div>
        </div>
    );
}