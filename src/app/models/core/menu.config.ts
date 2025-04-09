import { MenuItem } from 'src/app/models/core/menuItem';

export const MENU_ITEMS: MenuItem[] = [
  {
    module: '/home/dashboard',
    label: 'Dashboard',
    icon: 'home',
    isOpen: false,
    children: []
  },
  {
    label: 'Subscribers',
    icon: 'usergroup-add',
    module: '',
    isGroup: true,
    isOpen: false,
    children: [
      {
        module: '/subscribers/subscriber',
        label: 'Subscribers',
        icon: 'user',
        isOpen: false,
        children: []
      },
      {
        module: '/subscribers/tag',
        label: 'Tags',
        icon: 'tag',
        isOpen: false,
        children: []
      }
    ]
  },

  {
    label: 'Send',
    icon: 'mail',
    module: '',
    isGroup: true,
    isOpen: false,
    children: [
      {
        module: '/email/templates',
        label: 'Templates',
        icon: 'mail',
        isOpen: false,
        children: []
      },
      {
        module: '/email/campaigns',
        label: 'Campaigns',
        icon: 'mail',
        isOpen: false,
        children: []
      },
      {
        module: '/email/sequences',
        label: 'Sequences',
        icon: 'mail',
        isOpen: false,
        children: []
      }
    ]
  },
  {
    module: '/workflows',
    label: 'Workflows',
    icon: 'project',
    isOpen: false,
    children: []
  },
  {
    module: '/settings',
    label: 'Settings',
    icon: 'setting',
    isOpen: false,
    children: []
  },

  {
    module: '/admin',
    label: 'Admin',
    icon: 'user',
    isOpen: false,
    children: [
      {
        module: '/admin',
        label: 'Admin Dashboard',
        icon: 'home',
        isOpen: false,
        children: []
      },
      {
        module: '/admin/users',
        label: 'Users Management',
        icon: 'user',
        isOpen: false,
        children: []
      }
    ]
  }
];
