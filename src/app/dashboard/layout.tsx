'use client'
import BottomNav from "../components/dashboard/bottomnav"
import SideNav from "../components/dashboard/sidenav"
import TopPanel from "../components/dashboard/top-panel"
import { DrawerProvider } from "../contexts/DrawerContext"
import { MobileProvider } from "../contexts/MobileContext"


export default function Layout({ children }: { children: React.ReactNode }) {

    return (
      <MobileProvider>
        <DrawerProvider>
        <div className="relative">
          <header className="flex fixed top-0 left-0 right-0 items-center z-20 bg-white border-b border-gray-200 h-16">
            <TopPanel /> 
          </header>

          {/* Sidebar - layered on top */}
          <aside className="hidden md:block fixed top-0 left-0 w-44 h-full z-10">
            <SideNav />
          </aside>

          {/* Main content - responsive scrolling */}
          <main
            className={`
              bg-gray-50              
              overflow-y-auto
              md:ml-44
              mt-16    
                        
              touch-pan-y
              overscroll-contain
              min-h-screen
            `}
          >
            {children}
            
            {/* Bottom Spacer */}
            <div className="h-20 md:hidden"></div>
          </main>                    


            <footer className="md:hidden fixed bottom-0 left-0 right-0 z-20">
                <BottomNav />
            </footer>
            
        </div>
        </DrawerProvider>
      </MobileProvider>
    )
}