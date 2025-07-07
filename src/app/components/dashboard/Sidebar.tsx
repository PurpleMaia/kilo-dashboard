import React from "react";
import { HomeIcon, CubeIcon, MapIcon, UserIcon, CogIcon } from "@heroicons/react/24/outline";

const navItems = [
  { label: "Dashboard", icon: HomeIcon, href: "/dashboard" },
  { label: "July Dashboard", icon: HomeIcon, href: "/dashboard/july_dashboard" },
  { label: "Sensors", icon: CubeIcon, href: "/sensors" },
  { label: "Locations", icon: MapIcon, href: "/locations" },
  { label: "Data Upload", icon: CubeIcon, href: "/upload" },
  { label: "Data Management", icon: CogIcon, href: "/data-management" },
  { label: "Profile", icon: UserIcon, href: "/profile" },
  { label: "Settings", icon: CogIcon, href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="px-6 py-6 flex items-center gap-2 border-b">
        <span className="bg-green-500 rounded p-2">
          <HomeIcon className="h-6 w-6 text-white" />
        </span>
        <div>
          <div className="font-bold text-lg">KILO</div>
          <div className="text-xs text-gray-500">Sensor Dashboard</div>
        </div>
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-3 px-4 py-2 rounded text-gray-700 hover:bg-green-100 transition"
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
