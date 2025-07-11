
import NavLinks from './nav-links';


const BottomNav = () => {

  return (
    <>

      {/* Bottom navigation for mobile */}
        <div className="fixed bottom-0 left-0 right-0 h-16 z-40 bg-white backdrop-blur-sm border-t border-gray-200 bg-white border-t">
          <div className="flex grow flex-row space-x-2">
              <NavLinks />            
          </div>
        </div>
    </>
  );
};

export default BottomNav;
