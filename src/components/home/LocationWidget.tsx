'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { MalaGraph } from './MalaGraph';
import { useMobile } from '../../providers/MobileProvider';
import { LocationData } from '@/lib/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface LocationWidgetProps {
    locations: LocationData[];
}

function GraphSkeleton() {
    return (
        <div className="bg-white rounded-md border border-gray-300 shadow-lg md:mb-0 mb-10 animate-pulse">
            <div className="items-center justify-between mx-10 mt-8 mb-4">
                <div className="h-7 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="w-full h-[300px] flex items-center justify-center">
                <div className="w-[90%] h-full bg-gray-100 rounded"></div>
            </div>
            <div className="flex flex-wrap gap-4 mb-8 justify-center mt-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-7 w-16 bg-gray-200 rounded"></div>
                ))}
            </div>
        </div>
    )
}

export default function LocationWidget({ locations }: LocationWidgetProps) {
    const { isMobile } = useMobile();

    if (!locations || locations.length === 0) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-md border border-gray-300 shadow-lg">
                <GraphSkeleton />
            </div>
        )
    }

    return (
        <div className="w-full h-full">
            <Swiper
                spaceBetween={10}
                slidesPerView={1}
                navigation={!isMobile}
                pagination={isMobile}
                modules={[Navigation, Pagination]}
                style={{
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    ['--swiper-pagination-color' as any]: '#65a30d',                // active
                    ['--swiper-pagination-bullet-inactive-color' as any]: '#d1d5db',// inactive
                    ['--swiper-pagination-bullet-inactive-opacity' as any]: '1',
                    ['--swiper-navigation-color' as any]: '#65a30d',                // navigation arrows color
                    ['--swiper-navigation-size' as any]: '44px',                    // navigation button size
                    ['--swiper-navigation-top-offset' as any]: '89%',               // vertical position
                    ['--swiper-navigation-sides-offset' as any]: '20px', 
                    /* eslint-enable @typescript-eslint/no-explicit-any */
                }}                    
                className="h-full !px-4 md:!px-0"
                allowTouchMove={true}
                // touchStartPreventDefault={false}
                // preventClicks={false}
                // preventClicksPropagation={false}
            >
                {locations.map((location, index) => (
                    <SwiperSlide key={index}>
                        <MalaGraph location={location} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}