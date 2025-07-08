import SideNav from "../components/dashboard/sidenav"
import TopPanel from "../components/dashboard/top-panel"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>      
      <div className="relative h-screen overflow-hidden">
      {/* Topbar (edit to just show the hawaiian things */}
      <header className="flex items-center z-0 relative">
        <TopPanel /> 
      </header>

      {/* Sidebar - layered on top */}
      <aside className="hidden md:block absolute top-0 left-0 w-44 h-full z-10">
        <SideNav />
      </aside>

      {/* Main content - responsive scrolling */}
      <main
        className={`
          bg-gray-50
          md:overflow-hidden md:h-[calc(100vh-4rem)]
          overflow-auto h-[calc(100vh-4rem)]
          p-4
          md:ml-44
        `}
      >
        {children}
      </main>
    </div>   
    </>
    )
}