import SideNav from "../ui/dashboard/sidenav"
import TopPanel from "../ui/dashboard/top-panel"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>      
      <div className="relative h-screen overflow-hidden">
      {/* Topbar */}
      <header className="flex items-center z-0 relative">
        <TopPanel />
      </header>

      {/* Sidebar - layered on top */}
      <aside className="absolute top-0 left-0 w-64 h-full z-10g">
        <SideNav />
      </aside>

      {/* Main content, scrollable */}
      <main className="ml-64 h-[calc(100vh-4rem)] overflow-auto p-4 bg-white">
        {children}
      </main>
    </div>   
    </>
    )
}