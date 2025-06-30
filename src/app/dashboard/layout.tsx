import SideNav from "../ui/dashboard/sidenav"
import BottomNav from "../ui/dashboard/bottomnav"
import TopPanel from "../ui/dashboard/top-panel"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>      
      <div className="relative h-screen overflow-hidden">
      {/* Topbar (edit to just show the hawaiian things */}
      <header className="flex items-center z-0 relative">
        <TopPanel /> 
      </header>

      {/* Sidebar - layered on top */}
      <aside className="hidden md:block absolute top-0 left-0 w-64 h-full z-10">
        <SideNav />
      </aside>

      {/* Main content, scrollable */}
      <main
        className={`
          bg-white overflow-auto p-4
          h-[calc(100vh-7rem)] 
          md:ml-64 
        `}
      >
        {children}
      </main>
    </div>   
    </>
    )
}