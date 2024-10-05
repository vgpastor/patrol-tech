import { Routes } from '@angular/router';
import {ScanListComponent} from "../pages/scan-list/scan-list.component";
import {LandingComponent} from "../pages/landing/landing.component";
import {MainLayout} from "../layout/main-layout.component";
import {StartComponent} from "../pages/start/start.component";

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
        component: StartComponent
      }
    ]
  },
  {
    path: 'real-time',
    component: ScanListComponent
  }
];
