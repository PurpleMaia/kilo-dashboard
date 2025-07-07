import React from "react";
import { ArrowUpTrayIcon, DocumentMagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";

const actions = [
  {
    label: "Upload Data",
    description: "Import CSV sensor readings",
    icon: ArrowUpTrayIcon,
    href: "/upload"
  },
  {
    label: "View Reports",
    description: "Generate data reports",
    icon: DocumentMagnifyingGlassIcon,
    href: "/reports"
  },
  {
    label: "Manage Locations",
    description: "Add or modify sensor locations",
    icon: MapPinIcon,
    href: "/locations"
  }
];

export default function QuickActions() {
  return (
    <div className="mb-6">
      <div className="font-semibold text-lg mb-3">Quick Actions</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map(({ label, description, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className="flex flex-col items-start gap-2 bg-gray-50 border rounded-lg p-4 hover:bg-green-50 transition"
          >
            <Icon className="h-6 w-6 text-green-600" />
            <div className="font-medium">{label}</div>
            <div className="text-xs text-gray-500">{description}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
