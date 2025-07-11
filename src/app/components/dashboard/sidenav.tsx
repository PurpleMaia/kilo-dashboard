// import Link from 'next/link';
import NavLinks from '@/app/components/dashboard/nav-links';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col">      
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 bg-lime-900">
        <NavLinks />
      </div>
    </div>
  );
}
