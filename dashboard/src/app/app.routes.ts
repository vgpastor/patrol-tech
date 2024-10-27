import { Routes } from '@angular/router';
import {DashboardLayoutComponent} from "../layout/dashboard-layout.component";
import {FullLayoutComponent} from "../layout/full-layout.component";
import {DashboardPageComponent} from "../pages/dashboard/dashboard-page/dashboard-page.component";
import {AuthGuard} from "../services/auth/infrastructure/auth.guard";
import {LoginComponent} from "../pages/auth/login/login.component";
import {RecoverPasswordComponent} from "../pages/auth/recover-password.component";
import {ListScanPageComponent} from "../pages/dashboard/list-scan-page/list-scan-page.component";
import {UsersPageComponent} from "../pages/dashboard/users-page/users-page.component";

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardPageComponent
      },
      {
        path: 'scans',
        component: ListScanPageComponent
      },
      {
        path: 'users',
        component: UsersPageComponent
      }
    ]
  },
  {
    path: 'login',
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'recover',
        component: RecoverPasswordComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  }
];
