import NavLinks from './nav-links';


const BottomNav = () => {
  return (
    <>

      {/* Bottom navigation for mobile */}
      <div className="pt-1 px-1 inset-x-0 flex flex-row bottom-0 bg-white backdrop-blur-sm border-t border-gray-200 shadow-[0_-1px_10px_rgba(0,0,0,0.1)]" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
        <NavLinks />            
      </div>
    </>
  );
};

export default BottomNav;
