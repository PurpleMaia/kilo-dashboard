'use client'
import { useState } from 'react';
import { Ellipsis } from 'lucide-react';
import { moreLinks as links } from '@/lib/links';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function MoreLinksDrawer() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false); // Close drawer on any link click
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="flex flex-col items-center justify-center w-full min-w-[64px] max-w-[96px] px-0 py-0 gap-1 font-medium transition-colorsfocus:text-lime-600 focus:outline-none">
          <div className="flex items-center justify-center text-center transition-all duration-200 w-full pt-3">
            <Ellipsis className="w-6 h-6" />
          </div>
          <span className="text-xs text-center truncate w-full">More</span>
        </button>
      </DrawerTrigger>
      
      <DrawerContent className="border-gray-400 focus:outline-none bg-gray-50">
        <DrawerHeader className="text-center">
          <DrawerTitle>More Tools</DrawerTitle>          
        </DrawerHeader>
        
        <div className="px-4 grid mx-auto grid-cols-2 gap-4 max-w-md">
          {links.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className={clsx(
                  "py-4 px-16 flex flex-col items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                  "focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2",
                  {
                    'text-lime-600 border-lime-200 bg-lime-50': isActive,
                    'text-gray-700': !isActive,
                  }
                )}
              >
                  <LinkIcon className="w-6 h-6" />
                  <p className="text-sm whitespace-nowrap">{link.name}</p>

              </Link>
            );
          })}
        </div>
        
        <DrawerFooter className="pt-2">
          <button
            onClick={() => setIsOpen(false)}
            className="mx-auto px-8 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}