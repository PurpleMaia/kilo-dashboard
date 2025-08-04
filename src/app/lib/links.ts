import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Activity, BotMessageSquare, FileText, LayoutDashboard } from 'lucide-react';

export const links = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  // {
  //   name: 'Kilo',
  //   href: '/dashboard/kilo',
  //   icon: Eye,
  // },
  { name: 'Sensors', href: '/dashboard/sensors', icon: Activity },
  {
    name: 'Chat',
    href: '/dashboard/chat',
    icon: BotMessageSquare,
  },
  {
    name: 'Samples',
    href: '/dashboard/ag-testing',
    icon: FileText,
  },
  {
    name: 'Upload',
    href: '/dashboard/upload',
    icon: ArrowUpTrayIcon,
  },  
  // { name: 'Sensors', href: '/dashboard/sensors', icon: EyeIcon },
];

export const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/sensors': 'Sensor Overview',
  '/dashboard/kilo': 'Kilo Form',
  '/dashboard/ag-testing': 'Test Samples',
  '/dashboard/upload': 'Upload Center',
  '/dashboard/profile': 'Profile Settings',
  '/dashboard/chat': 'Kilo Chat',
};