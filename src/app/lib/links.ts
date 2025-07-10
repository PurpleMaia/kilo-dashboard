import {
  HomeIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export const links = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Kilo',
    href: '/dashboard/kilo',
    icon: EyeIcon,
  },
  // {
  //   name: 'Ag Testing',
  //   href: '/dashboard/ag-testing',
  //   icon: UserGroupIcon,
  // },
  {
    name: 'Chat',
    href: '/dashboard/chat',
    icon: ChatBubbleLeftRightIcon,
  },
  { name: 'Sensors', href: '/dashboard/sensors', icon: UserGroupIcon },
  // {
  //   name: 'Upload Data',
  //   href: '/dashboard/upload',
  //   icon: ArrowUpTrayIcon,
  // },  
  // { name: 'Sensors', href: '/dashboard/sensors', icon: EyeIcon },
];

export const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/sensors': 'Sensor Overview',
  '/dashboard/kilo': 'Kilo Form',
  '/dashboard/ag-testing': 'Agriculture Testing Center',
  '/dashboard/upload': 'Upload Center',
  '/dashboard/profile': 'Profile Settings',
  '/dashboard/chat': 'Kilo Chat',
};