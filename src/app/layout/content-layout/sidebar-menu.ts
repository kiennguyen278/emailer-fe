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
    name: 'Người dùng và quyền',
    icon: 'icons:icn-user-manage',
    path: '/user-role',
    display: true,
    // permissionCode: PermissionOutPatient.DM0023,
    // permissionType: PermissionModule.OUTPATIENT,
    children: [
      {
        name: 'Quản lý vai trò',
        icon: '',
        path: '/user-role/role-manager',
        display: true,
        // permissionCode: PermissionOutPatient.DM0023,
        // permissionType: PermissionModule.OUTPATIENT,
        children: []
      },
      {
        name: 'Quản lý người dùng',
        icon: '',
        path: '/user-role/user-manager',
        display: true,
        children: []
      }
    ]
  },
  {
    name: 'Cấu hình danh mục',
    icon: 'icons:icn-config-application',
    path: '/categories-config',
    display: true,
    children: [
      // {
      //   name: 'Cấu hình danh mục',
      //   icon: '',
      //   path: '/app-config/categories-config',
      //   display: true,
      //   children: []
      // },
    ]
  },
  {
    name: 'Cấu hình dịch vụ',
    icon: 'icons:icn-settings',
    path: '/service-configuration',
    display: true,
    children: [
      {
        name: 'Cấu hình lĩnh vực',
        icon: '',
        path: '/service-configuration/config-field',
        display: true,
        children: []
      },
      {
        name: 'Cấu hình dịch vụ',
        icon: '',
        path: '/service-configuration/service-config',
        display: true,
        children: []
      },
      // {
      //   name: 'Cấu hình sản phẩm',
      //   icon: '',
      //   path: '/service-configuration/product-configuration',
      //   display: true,
      //   children: []
      // },
    ]
  }, 
  {
    name: 'Cấu hình dịch vụ VDTC',
    icon: 'icons:icn-car',
    path: '/main-service-configuration/main-service-configuration',
    display: true,
    children: [
      // {
      //   name: 'Cấu hình dịch vụ VDTC',
      //   icon: '',
      //   path: '/main-service-configuration/main-service-configuration',
      //   display: true,
      //   children: []
      // },
    ]
  },
  {
    name: 'Cấu hình video',
    icon: 'icons:icn-video',
    path: '/video-configuration/video-configuration',
    display: true,
    children: [
      // {
      //   name: 'Cấu hình video',
      //   icon: '',
      //   path: '/video-configuration/video-configuration',
      //   display: true,
      //   children: []
      // },
    ]
  },
  {
    name: 'Quản lý tin tức',
    icon: 'icons:icn-news',
    path: '/news-manager',
    display: true,
    children: [
      // {
      //   name: 'Quản lý nội dung',
      //   icon: '',
      //   path: '/news-manager/list',
      //   display: true,
      //   children: []
      // },
      // {
      //   name: 'Tạo mới nội dung',
      //   icon: '',
      //   path: '/news-manager/create',
      //   display: true,
      //   children: []
      // },
    ]
  },
  {
    name: 'Cấu hình banner',
    icon: 'icons:icn-banner',
    path: '/banner-config/banner-config',
    display: true,
    children: [
      // {
      //   name: 'Cấu hình banner',
      //   icon: '',
      //   path: '/banner-config/banner-config',
      //   display: true,
      //   children: []
      // },
    ]
  }
];
