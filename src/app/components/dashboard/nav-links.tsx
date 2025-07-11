'use client'
import { links } from '@/app/lib/links'
import Link from 'next/link' // no page refresh, optimizes and prefetches code on navigation
import { usePathname } from 'next/navigation'; // React web hook (client) to get the current path (need to declare a Client Component)
import clsx from 'clsx';
import { useMobile } from '@/app/contexts/MobileContext';
// import { Ellipsis } from 'lucide-react';
// import { useDrawer } from '@/app/contexts/DrawerContext';


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.


export default function NavLinks() {
  const pathname = usePathname()
  const { isMobile } = useMobile()
  // const { isOpen, openDrawer, closeDrawer } = useDrawer()
  
  return (
    <>
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              // if the pathname matches the link.href, then highlight blue
              className={clsx(
                "pl-2 grow gap-2 font-medium items-center transition-colors",
                {
                  'text-lime-600' : pathname === link.href,
                  'flex text-white justify-begin' : !isMobile,
                  'justify-center' : isMobile
                }
              )}        
            >
              <div className={clsx(
                'pt-3 flex items-center justify-center text-center transition-all duration-200', 
                {
                  'border-t-2 border-lime-600' : pathname === link.href
                }
              )}>
                <LinkIcon className="w-6" />
              </div>
                <p className={clsx(
                  'text-center',
                  {
                    'text-xs' : isMobile 
                  }
                )}>{link.name}</p>
            </Link>          
          );
        })}        
        {/* <div className='md:hidden pt-3'>
          <button 
            className='text-xs flex flex-col px-6'
            onClick={isOpen ? closeDrawer : openDrawer}
          >
            <Ellipsis className='!w-6 !h-6'/>
            More
          </button>
        </div> */}
    </>
  );
}
