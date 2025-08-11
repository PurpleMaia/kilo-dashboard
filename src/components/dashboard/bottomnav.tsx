import NavLinks from './nav-links';


const BottomNav = () => {
  return (
    <>

      {/* Bottom navigation for mobile */}
      <div className="pt-[1px] px-1 inset-x-0 flex flex-row bottom-0 bg-white backdrop-blur-sm border-t border-gray-200" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
        <NavLinks />            
      </div>
    </>
  );
};

export default BottomNav;
