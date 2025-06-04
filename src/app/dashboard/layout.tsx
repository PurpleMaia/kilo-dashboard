import SideNav from "../ui/sidenav"
import TopPanel from "../ui/top-panel"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <>      
      <div className='flex h-screen'>
        {/* Side Navigation */}
        <div className="w-64 flex-none">
            <SideNav />
        </div>
        
        {/* Main Content Area */}
        <div className='flex-1 flex flex-col'>
            <TopPanel />
            <main className='flex-1 p-6'>                           
                {children}
            </main>      
        </div>
      </div>
    </>
    )
}