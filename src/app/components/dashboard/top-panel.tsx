'use client'

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { links } from "@/app/lib/links";
import Link from 'next/link'
import clsx from 'clsx';
import { BellAlertIcon,  } from "@heroicons/react/24/outline";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/ui/dropdown-menu";
import { User } from "lucide-react";
import { Button } from "@/app/ui/button";
import { pageTitles } from "@/app/lib/links";
import useScreenSize from "@/app/lib/hooks";
import { useMobile } from '../../contexts/MobileContext';


export default function TopPanel() {
  const pathname = usePathname();
  const currentTitle = pageTitles[pathname];
  const screenSize = useScreenSize()
  const { isMobile } = useMobile();

  const [isOpen, setIsOpen] = useState(false);
  // const [isMobile, setIsMobile] = useState(false); // This line is removed as per the new_code

  useEffect(() => {
    if (screenSize.width < 600) {
      // setIsMobile(true) // This line is removed as per the new_code
    } else {
      // setIsMobile(false) // This line is removed as per the new_code
    }
  }, [screenSize.width])

  const handleSignout = async () => {
    try {
      const response = await fetch('/api/signout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(data.message);
        // Redirect to home page after successful signout
        window.location.href = '/';
      } else {
        console.error('Signout failed:', data.error || 'Unknown error');
        // Optionally show user-friendly error message
        alert('Sign out failed. Please try again.');
      }
    } catch (e) {
      console.error("Error signing out:", e);
      alert('Sign out failed. Please try again.');
    }
  }

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* First Line - Alerts and Login/Logout */}
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h1 className={clsx(
            "text-2xl font-bold text-slate-900",
            isMobile ? "justify-between" : "ml-44"
          )}> {currentTitle} </h1>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" size="sm" className="rounded-full">            
              <BellAlertIcon className="h-10 w-10" /> 
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <User className="h-10 w-10" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem>
                  <Link href={"/dashboard/profile"}>                
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>          
          </div>
        </div>
      </div>

      {/* Second Line - Moon and Solstice Info (tookout for now to see full view) */}
      {/* <div className="px-6 py-3">
        <div className="flex items-center gap-6 justify-end">
          <div className="items-center text-right">
            <div className="text-xs text-gray-600">MOON</div>
            <div className="text-md font-semibold">Hoku</div>
          </div>

          <div className="items-center text-right">
            <div className="text-xs text-gray-600">SOLSTICE</div>
            <div className="text-md font-semibold">Summer</div>
          </div>

          <div className="items-center text-right">
            <div className="text-xs text-gray-600">WEATHER</div>
            <div className="text-md font-semibold">{temp}°F</div>
          </div>
        </div>
      </div> */}

      {/* Mobile Hamburger Button */}
      {/* <div className="lg:hidden fixed top-4 left-4 z-50 flex gap-4">
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
        

      </div> */}

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
    </div>
  );
}