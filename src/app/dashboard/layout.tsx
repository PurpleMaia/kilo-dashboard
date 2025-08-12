'use client'
import BottomNav from "@/components/dashboard/bottomnav"
import TopPanel from "@/components/dashboard/top-panel"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="grid grid-rows-[auto_1fr_auto] h-screen overflow-hidden">

        <header className="bg-gradient-to-r from-lime-800 to-lime-700 z-20">
          <TopPanel /> 
        </header>            

        <main className="overflow-y-auto overflow-x-hidden overscroll-contain scrolling-hero">              
          {children}              
        </main>

        <footer className="bottom-0 z-20">            
          <BottomNav />
        </footer>

      </div>        
    )
}