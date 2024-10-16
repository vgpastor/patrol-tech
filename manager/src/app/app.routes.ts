import { Routes } from '@angular/router';
import {LandingComponent} from "../pages/landing/landing.component";
import {MainLayout} from "../layout/main-layout.component";
import {StartComponent} from "../pages/start/start.component";
import {DashboardLayoutComponent} from "../layout/dashboard-layout.component";
import {FullLayoutComponent} from "../layout/full-layout.component";
import {DashboardPageComponent} from "../pages/dashboard/dashboard-page/dashboard-page.component";
import {AuthGuard} from "../services/auth/infrastructure/auth.guard";
import {LoginComponent} from "../pages/auth/login/login.component";
import {HowToStartPageComponent} from "../pages/landing/how-to-start-page.component";
import {RecoverPasswordComponent} from "../pages/auth/recover-password.component";

export const routes: Routes = [
  { path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: LandingComponent
      },
      {
        path: 'start',
        component: StartComponent,
      },
      {
        path: 'how-to-start',
        component: HowToStartPageComponent
      }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardPageComponent
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
  }
];
