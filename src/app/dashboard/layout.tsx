'use client'
import BottomNav from "@/components/dashboard/bottomnav"
import SideNav from "@/components/dashboard/sidenav"
import TopPanel from "@/components/dashboard/top-panel"
import { useMobile } from "@/providers/MobileProvider"
// import ChatWidget from "@/components/llm/ChatWidget"

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isMobile } = useMobile()
    return (
      <>
      { isMobile ? (
        <div className="grid grid-rows-[auto_1fr_auto] h-screen overflow-hidden">

          <header className="bg-gradient-to-r from-lime-800 to-lime-700 z-20">
            <TopPanel /> 
          </header>            

          <main className="overflow-y-auto overflow-x-hidden overscroll-contain scrolling-hero ">
            {children}              
          </main>

          {/* {process.env.NODE_ENV === 'development' && (
            <div className="right-2 z-50 bottom-25 fixed flex items-end">
              <ChatWidget />
            </div>
          )} */}

                
          <footer className="bottom-0 z-20 ">            
            <BottomNav />
          </footer>        
          
        </div>    
      ) : (
        <div className="h-screen flex bg-gray-50">
          <SideNav />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopPanel />
            
            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-full space-y-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
      </>
    )
}