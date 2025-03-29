export interface MenuItem {
  name: string;
  icon: string;
  path: string;
  display: boolean;
  children: MenuItem[];
  permissionCode?: string | any;
  permissionType?: string | any;
}
export const MENUITEMS: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: 'icons:icn-dashboard',
    path: '/dashboard',
    display: true,
    children: []
  },
  {
    name: 'Subscribers',
    icon: 'icons:icn-user-manage',
    path: '/subscribers',
    display: true,
    // permissionCode: PermissionOutPatient.DM0023,
    // permissionType: PermissionModule.OUTPATIENT,
    children: [
      {
        name: 'Danh sách subscriber',
        icon: '',
        path: '/subscribers/subscriber',
        display: true,
        // permissionCode: PermissionOutPatient.DM0023,
        // permissionType: PermissionModule.OUTPATIENT,
        children: []
      },
      {
        name: 'Danh sách tag',
        icon: '',
        path: '/subscribers/tag',
        display: true,
        // permissionCode: PermissionOutPatient.DM0023,
        // permissionType: PermissionModule.OUTPATIENT,
        children: []
      },
    ]
  },
];
