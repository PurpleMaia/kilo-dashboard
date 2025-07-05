'use client'
import { links } from '@/app/lib/links'
import Link from 'next/link' // no page refresh, optimizes and prefetches code on navigation
import { usePathname } from 'next/navigation'; // React web hook (client) to get the current path (need to declare a Client Component)
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.


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
              "pl-2 flex grow items-center justify-begin gap-2 rounded-md text-sm text-white font-medium",
              {
                'text-blue-600' : pathname === link.href
              }
            )}
            
          >
            <LinkIcon className="w-6" />
            <p className="">{link.name}</p>
          </Link>          
        );
      })}
    </>
  );
}
