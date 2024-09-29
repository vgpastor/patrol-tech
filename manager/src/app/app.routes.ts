import { Routes } from '@angular/router';
import {ScanListComponent} from "../pages/scan-list/scan-list.component";
import {LandingComponent} from "../pages/landing/landing.component";

export const routes: Routes = [
  { path: '',
    component: LandingComponent
  },
  {
    path: 'real-time',
    component: ScanListComponent
  }
];
