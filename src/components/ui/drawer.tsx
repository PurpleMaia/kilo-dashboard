'use client'
import { useDrawer } from '@/providers/DrawerProvider';
import { useEffect, useRef } from 'react';
import { moreLinks as links } from '@/lib/links';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function Drawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const pathname = usePathname()
  
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className="h-1/3 fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-xl z-50 transform transition-all duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >            
        
        {/* Content */}
        <div className="p-4 grid grid-cols-2 gap-4 justify-center">
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
              key={link.name}
              href={link.href}    
              onClick={closeDrawer}
              className={clsx(
                  // Set fixed width and flex column for even spacing
                  "transition-colors focus:outline-none",
                  {
                    'text-lime-600' : pathname === link.href,
                  }
                )}               
              >              
              
              <div className='border border-gray-200 shadow-lg p-8 rounded-md text-lg'>
                <div className='flex gap-2 mb-2'>
                  <LinkIcon className="w-8 h-8" />
                  <p className='text-center truncate w-full'>{link.name}</p>
                </div>

                <div className={clsx(
                  'transition-all duration-200 w-full', 
                  {
                    'border-t-2 border-lime-600' : pathname === link.href,                    
                  }
                )}>
                </div>

              </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  );
}
