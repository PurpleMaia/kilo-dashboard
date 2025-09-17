// import Link from 'next/link';
import { useState } from 'react';
import { mainLinks as links } from '@/lib/links'

import { ChevronLeft, ChevronRight, Hamburger, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname()
  
  return (
    <div className={cn(
      "bg-lime-900 text-white transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-56"
    )}>
      <div className="flex h-full flex-col">    

        <div className="flex items-center align-middle justify-between bg-lime-900 mr-2">
          {!collapsed && (
            <h2 className="text-xl font-bold text-white p-4">KILO</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="py-2 px-3 rounded-lg hover:bg-lime-800 text-white ml-2 my-4"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 px-2 space-y-2">
          {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                // Set fixed width and flex column for even spacing
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white align-middle",
                {
                  'bg-lime-700' : pathname === link.href,
                  'hover:bg-lime-800 hover:text-white' : pathname !== link.href,                  
                }
              )}        
            >
              <LinkIcon className="w-5 h-5 flex-shrink-0" />                         

               {!collapsed && <span className="ml-3">{link.name}</span>}
            </Link>          
          );
        })}     
        </div>
      </div>
    </div>

  );
}
