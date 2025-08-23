'use client'
import { mainLinks as links } from '@/lib/links'
import Link from 'next/link' // no page refresh, optimizes and prefetches code on navigation
import { usePathname } from 'next/navigation'; // React web hook (client) to get the current path (need to declare a Client Component)
import clsx from 'clsx';
import { useMobile } from '@/providers/MobileProvider';

import { Ellipsis } from 'lucide-react';
import { MoreLinksDrawer } from './more-links';


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.


export default function NavLinks() {
  const pathname = usePathname()
  const { isMobile } = useMobile()
  
  return (
    <>
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                // Set fixed width and flex column for even spacing
                "flex flex-col items-center justify-center w-full min-w-[64px] max-w-[96px] px-0 py-0 gap-1 font-medium transition-colors",
                {
                  'text-lime-600' : pathname === link.href,
                  'text-white' : !isMobile,
                  'justify-between' : isMobile
                }
              )}        
            >
              <div className={clsx(
                'flex items-center justify-center text-center transition-all duration-200 w-full', 
                {
                  'border-t-2 border-lime-600 pt-3' : pathname === link.href,
                  'pt-3' : pathname !== link.href
                }
              )}>
                <LinkIcon className="w-6 h-6" />
              </div>
              <p className={clsx(
                'text-center truncate w-full', // truncate and force label to single line
                {
                  'text-xs' : isMobile 
                }
              )}>{link.name}</p>
            </Link>          
          );
        })}     

        <MoreLinksDrawer />
     </> 
  );
}
