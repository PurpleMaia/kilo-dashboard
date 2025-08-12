'use client'
import BottomNav from "@/components/dashboard/bottomnav"
import TopPanel from "@/components/dashboard/top-panel"
import { DrawerProvider } from "@/hooks/use-drawer"
import { MobileProvider } from "@/hooks/use-mobile"


export default function Layout({ children }: { children: React.ReactNode }) {

    return (
      <MobileProvider>
        <DrawerProvider>
          <div className="flex flex-col h-full overflow-hidden"
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>

            <header 
              className="bg-gradient-to-r from-lime-800 to-lime-700 fixed top-0 left-0 right-0 z-20 w-full touch-none flex-shrink-0"
              style={{ paddingTop: 'env(safe-area-inset-top)'}}
            >
              <TopPanel /> 
            </header>            


            {/* Main content - responsive scrolling */}
            <main
              className={`                          
                flex-1                                
                overflow-y-auto
                overflow-x-hidden
                overscroll-contain
                h-full
                scrolling-hero                
                `}
              style={{ marginTop: 'calc(4rem + env(safe-area-inset-top))', marginBottom: 'calc(3.75rem + env(safe-area-inset-bottom))' }}
            >              
              {children}              
            </main>

            <footer className="fixed bottom-0 left-0 right-0 z-20 overflow-hidden flex-shrink-0">
              <BottomNav />
            </footer>
          </div>
        </DrawerProvider>
      </MobileProvider>
    )
}