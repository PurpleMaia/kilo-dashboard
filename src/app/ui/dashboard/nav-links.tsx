'use client'

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link' // no page refresh, optimizes and prefetches code on navigation
import { usePathname } from 'next/navigation'; // React web hook (client) to get the current path (need to declare a Client Component)
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Kilo',
    href: '/dashboard/kilo',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Sensors', href: '/dashboard/sensors', icon: EyeIcon },
  // { name: 'Soil', href: '/dashboard/soil', icon: UserGroupIcon },
  // { name: 'Water', href: '/dashboard/water', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname()
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
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                'bg-sky-100 text-blue-600' : pathname === link.href
              }
            )}
            
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>          
        );
      })}
    </>
  );
}
