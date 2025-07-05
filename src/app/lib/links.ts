import {
  HomeIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  UserCircleIcon,
  EyeIcon,
  UserGroupIcon
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
  {
    name: 'Ag Testing',
    href: '/dashboard/ag-testing',
    icon: UserGroupIcon,
  },
  { name: 'Sensors', href: '/dashboard/sensors', icon: UserGroupIcon },
  {
    name: 'Upload Data',
    href: '/dashboard/upload',
    icon: ArrowUpTrayIcon,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: UserCircleIcon,
  },
  // { name: 'Sensors', href: '/dashboard/sensors', icon: EyeIcon },
];