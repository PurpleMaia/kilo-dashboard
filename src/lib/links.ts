// import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Activity, Eye, FileText, LayoutDashboard, UploadIcon } from 'lucide-react';
//BotMessageSquare

export const mainLinks = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  { name: 'Sensors', href: '/dashboard/sensors', icon: Activity },
  {
    name: 'Kilo',
    href: '/dashboard/kilo',
    icon: Eye,
  },
  // {
  //   name: 'Chat',
  //   href: '/dashboard/chat',
  //   icon: BotMessageSquare,
  // },
  
];

export const moreLinks = [
  {
    name: 'View/Upload Samples',
    href: '/dashboard/ag-testing',
    icon: FileText,
  },
  {
    name: 'Upload New Data', href: '/dashboard/upload', icon: UploadIcon,
  },  
]
export const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/sensors': 'Sensor Overview',
  '/dashboard/kilo': 'Kilo Journal (beta)',
  '/dashboard/ag-testing': 'Test Samples',
  '/dashboard/upload': 'Upload Center',
  '/dashboard/profile': 'Profile Settings',
  '/dashboard/chat': 'Chat (beta)',
};

