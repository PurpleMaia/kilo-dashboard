'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { MalaGraph } from './MalaGraph';
import { useMobile } from '../../contexts/MobileContext';
import { MalaData } from '../../lib/data';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface LocationWidgetProps {
    locations: MalaData[];
}

export default function LocationWidget({ locations }: LocationWidgetProps) {
    const { isMobile } = useMobile();

    if (locations.length === 0) return <div className="text-center py-4">No locations found</div>;

    return (
        <div className="w-full h-full">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation={!isMobile}
                    pagination={true}
                    modules={[Navigation, Pagination]}
                    style={{
                        // CSS vars – these always win because they’re on the element itself
                        ['--swiper-pagination-color' as any]: '#65a30d',                // active
                        ['--swiper-pagination-bullet-inactive-color' as any]: '#d1d5db',// inactive
                        ['--swiper-pagination-bullet-inactive-opacity' as any]: '1',
                    }}                    
                    className="h-full !px-4"
                    allowTouchMove={true}
                    touchStartPreventDefault={false}
                    preventClicks={false}
                    preventClicksPropagation={false}
                >
                    {locations.map((location, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white rounded-lg border border-gray-300 h-full flex flex-col">
                                <div className="pt-4 px-4 flex items-center justify-between mb-4 flex-shrink-0">
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

                                <MalaGraph data={location.data} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
        </div>
    );
}