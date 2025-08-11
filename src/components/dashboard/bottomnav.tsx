import NavLinks from './nav-links';


const BottomNav = () => {
  return (
    <>

      {/* Bottom navigation for mobile */}
      <div className="fixed inset-x-0 flex grow flex-row bottom-0 w-full z-40 bg-white backdrop-blur-sm border-t border-gray-200 pb-2" style={{paddingBottom: 'env(safe-area-inset-bottom, 0.25rem)'}}>
        <NavLinks />            
      </div>
    </>
  );
};

export default BottomNav;
