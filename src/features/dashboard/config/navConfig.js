import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  UserCheck,
  Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    path: '/dashboard/bookings',
    label: 'Reservas',
    icon: Calendar,
  },
  {
    path: '/dashboard/employees',
    label: 'Empleados',
    icon: Users,
  },
  {
    path: '/dashboard/services',
    label: 'Servicios',
    icon: Briefcase,
  },
  {
    path: '/dashboard/customers',
    label: 'Clientes',
    icon: UserCheck,
  },
  {
    path: '/dashboard/settings',
    label: 'Configuración',
    icon: Settings,
  },
];
