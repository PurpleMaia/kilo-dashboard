'use client'
import BottomNav from "@/components/dashboard/bottomnav"
import TopPanel from "@/components/dashboard/top-panel"
import { DrawerProvider } from "@/contexts/DrawerContext"
import { MobileProvider } from "@/contexts/MobileContext"


export default function Layout({ children }: { children: React.ReactNode }) {

    return (
      <MobileProvider>
        <DrawerProvider>
          <div className="flex flex-col h-dvh overflow-hidden">

            <header 
              className="bg-white fixed top-0 left-0 right-0 z-20 w-full"
              style={{ paddingTop: 'env(safe-area-inset-top)'}}
            >
              <TopPanel /> 
            </header>            

            {/* Main content - responsive scrolling */}
            <main
              className={`
                bg-gray-50              
                flex-1                
                touch-pan-y
                overflow-y-auto
                overscroll-contain
                h-full
                relative
                z-10
              `}
              style={{ marginTop: 'calc(4.5rem + env(safe-area-inset-top))', marginBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
            >
              {children}
              
            </main>

            <footer className="fixed bottom-0 left-0 right-0 z-20">
              <BottomNav />
            </footer>
          </div>
        </DrawerProvider>
      </MobileProvider>
    )
}