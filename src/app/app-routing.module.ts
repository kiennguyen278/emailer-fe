import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';

// Layout component
// import { BackstageTopbannerComponent as BackstageLayoutComponent} from './layouts/backstage-topbanner/backstage-topbanner.component';
import { BackstageDefaultComponent as BackstageLayoutComponent } from './layouts/backstage-default/backstage-default.component';
import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";
import {AuthGuard} from "@core/guards/auth.guard";
import {LoginAuthGuard} from "@core/guards/login-auth.guard";
import {PermissionService} from "@core/services/permission.service";
import {Role} from "@core/enums";

const routes: Routes = [
  {
    path: '',
    component: BackstageLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home/dashboard', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () => import('./pages/backstage/home/home.module').then((m) => m.HomeModule)
      },

      // {
      //   path: 'system',
      //   loadChildren: () =>
      //     import('./pages/backstage/system/system.module').then(
      //       (m) => m.SystemModule
      //     ),
      // },
      {
        path: 'subscribers',
        loadChildren: () => import('./pages/backstage/subscribers/subscribers.module').then((m) => m.SubscribersModule),
      },

      {
        path: 'email',
        loadChildren: () => import('./pages/backstage/email/email.module').then((m) => m.EmailModule)
      },

      {
        path: 'workflows',
        loadChildren: () => import('./pages/backstage/workflows/workflows.module').then((m) => m.WorkflowsModule)
      },

      // Settings (1 module cha, 1 component hoặc nhiều component con)
      {
        path: 'settings',
        loadChildren: () => import('./pages/backstage/settings/settings.module').then((m) => m.SettingsModule)
      },

      {
        path: 'admin',
        loadChildren: () => import('./pages/backstage/admin/admin.module').then((m) => m.AdminModule),
        data: {
          permissions: {
            allow: [Role.ADMIN],
          }
        },
        canActivate: [PermissionService]
      },

      {
        path: 'exception',
        loadChildren: () => import('./pages/commons/exception/exception.module').then((m) => m.ExceptionModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./pages/account/account.module').then((m) => m.AccountModule),
    canActivate: [LoginAuthGuard],
  },
  // Fallback route for undefined paths
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,  // useHash này là có hiện dấu # trên url router hay ko, ví dụ: "useHash: false" => "/home/dashboard"; "useHash: true" => "/#/home/dashboard"
    scrollPositionRestoration: "enabled", // Điều khiển việc quay lại vị trí scroll khi back/forward: 'disabled', 'enabled', 'top'.
    preloadingStrategy: PreloadAllModules, // PreloadAllModules: Tải trước tất cả các module lazy-loaded ngay sau khi app load xong; NoPreloading: (default)	Không preload, chỉ load khi navigate tới route.
    // initialNavigation: "enabledBlocking", // Điều khiển lần navigate đầu tiên. enabledBlocking sẽ chờ Navigation xong mới bootstrap app. Rất hữu ích với SSR.
    paramsInheritanceStrategy: 'always', // 'emptyOnly' (default) | 'always', dùng 'always' để khi vào path trong router con thì vẫn lấy đc param url của router cha, nếu để "emptyOnly" thì vào trong path component con ko lấy đc path của router cha
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
