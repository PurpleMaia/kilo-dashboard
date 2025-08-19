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

export default function LocationWidget({ locations }: LocationWidgetProps) {
    const { isMobile } = useMobile();
    return (
        <div className="w-full h-fit">
            <Swiper
                spaceBetween={10}
                slidesPerView={1}
                navigation={!isMobile}
                pagination={true}
                modules={[Navigation, Pagination]}
                style={{
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    ['--swiper-pagination-color' as any]: '#65a30d',                // active
                    ['--swiper-pagination-bullet-inactive-color' as any]: '#d1d5db',// inactive
                    ['--swiper-pagination-bullet-inactive-opacity' as any]: '1',
                    /* eslint-enable @typescript-eslint/no-explicit-any */
                }}                    
                className="h-fit !px-4"
                allowTouchMove={true}
                touchStartPreventDefault={false}
                preventClicks={false}
                preventClicksPropagation={false}
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