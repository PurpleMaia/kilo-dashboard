'use client'

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  BellAlertIcon,
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  UserCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link'
import clsx from 'clsx';

const links = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Kilo',
    href: '/dashboard/kilo',
    icon: EyeIcon,
  },
  { name: 'Water Quality', href: '/dashboard/water', icon: UserGroupIcon },
  { name: 'Soil Quality', href: '/dashboard/soil', icon: UserGroupIcon },
  { name: 'Sensors', href: '/dashboard/sensors', icon: UserGroupIcon },
  {
    name: 'Upload',
    href: '/dashboard/upload',
    icon: ArrowUpTrayIcon,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: UserCircleIcon,
  },
  // { name: 'Sensors', href: '/dashboard/sensors', icon: EyeIcon },
];

// Define a mapping of route paths to page titles
const pageTitles: Record<string, string> = {
  '/dashboard': 'Kilo Dashboard',
  '/dashboard/sensors': 'Sensor Overview',
  '/dashboard/kilo': 'Kilo Form',
  '/dashboard/water': 'Water Quality',
  '/dashboard/soil': 'Soil Quality',
  '/dashboard/upload': 'Upload Center',
  '/dashboard/profile': 'Profile Settings',
};

export default function TopPanel() {
  const pathname = usePathname();
  const currentTitle = pageTitles[pathname];

  const [isOpen, setIsOpen] = useState(false);
  
    // // Time Section
    // const [currentTime, setCurrentTime] = useState(new Date());
    // useEffect(() => {
    //     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    //     return () => clearInterval(timer);
    // }, []);

    return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4">
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 flex gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white/90 backdrop-blur-sm shadow border"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          )}
        </button>
        <div className="text-xl font-black text-gray-800 py-2">{currentTitle}</div>

      </div>

      {/* Overlay Mobile Menu */}
      {isOpen && (
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
          }`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`
              absolute top-20 left-4 right-4 p-4 rounded-lg shadow bg-white/95 backdrop-blur-sm
              transform transition-all duration-300 ease-out
              ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {links.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  // if the pathname matches the link.href, then highlight blue
                  className={clsx(
                    "flex h-[48px] grow items-center justify-begin gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium",
                    {
                      'bg-sky-100 text-blue-600' : pathname === link.href
                    }
                  )}
                  onClick={() => setIsOpen(false)}                
                >
                  <LinkIcon className="w-6" />
                  <p className="">{link.name}</p>
                </Link>          
              );
            })}
          </div>
        </div>
      )}

      {/* Page Title */}

      {/* Main TopBar Content */}
      <div className="flex items-center gap-6 justify-end">
        <div className="items-center text-right">
          <div className="text-xs text-gray-600">MOON PHASE</div>
          <div className="text-md font-semibold">Hoku</div>
        </div>

        <div className="items-center text-right">
          <div className="text-xs text-gray-600">SOLSTICE</div>
          <div className="text-md font-semibold">Summer</div>
        </div>

        <div className="items-center">
          <button className="flex gap-1 border font-semibold drop-shadow-sm px-4 py-3 rounded-lg text-sm">
            Alerts 
            <BellAlertIcon className="h-5 w-5" /> 
          </button>
        </div>
      </div>
    </header>
  );
}