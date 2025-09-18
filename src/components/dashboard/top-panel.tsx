'use client'

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { mainLinks as links } from "@/lib/links";
import Link from 'next/link'
import clsx from 'clsx';
import { BellAlertIcon,  } from "@heroicons/react/24/outline";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageTitles } from "@/lib/links";
import useScreenSize from "@/hooks/use-screensize";
import { useMobile } from '../../providers/MobileProvider';


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

  return (
    <div className={clsx("w-full py-3",
      isMobile ? "bg-gradient-to-r from-lime-800 to-lime-700" : "bg-white border-b border-gray-200"
    )}
    >     
        {isMobile ? (
          <div className="flex justify-between items-center">
            <Link className='text-white' href={"/dashboard/profile"}>                
                <User className="h-5! w-5!" /> 
            </Link>              

            <h1 className="text-2xl font-light text-white"> {currentTitle} </h1>

            <BellAlertIcon className="h-5! w-5! text-white" />
          </div>
        ) : (
          <div className="flex justify-between items-center mx-6">                     
            <h1 className="text-2xl font-bold text-gray-900 py-1"> {currentTitle} </h1>

            <div className="flex space-x-12 items-center">
              <BellAlertIcon className="h-5! w-5! text-gray-900" /> 

              <Link className='text-gray-900 mr-2 hover:bg-gray-100 rounded-md p-2 transition-colors' href={"/dashboard/profile"}>                
                  <User className="h-5! w-5!" /> 
              </Link>                   
            </div>

            
          </div>
        )}   
        
      </div>            
  );
}