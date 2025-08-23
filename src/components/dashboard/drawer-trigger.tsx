'use client'
import { Ellipsis } from 'lucide-react';
import { useDrawer } from '@/providers/DrawerProvider';

export function DrawerTrigger() {
  const { toggleDrawer } = useDrawer();

  return (
    <div>
      <button
        onClick={toggleDrawer}
        className="flex flex-col items-center justify-center w-full min-w-[64px] max-w-[96px] px-0 py-0 gap-1 font-medium transition-colors focus:text-lime-600"
        aria-label="Open navigation menu"
        aria-expanded={false}
      >
        <div className="flex items-center justify-center text-center transition-all duration-200 w-full pt-3">
          <Ellipsis className="w-6 h-6" />
        </div>
        <span className="text-xs text-center truncate w-full">More</span>
      </button>
    </div>
  );
}