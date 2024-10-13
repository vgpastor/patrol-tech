import { Routes } from '@angular/router';
import {HomePageComponent} from "../pages/home-page/home-page.component";
import {LoginPageComponent} from "../pages/login-page/login-page.component";
import {AuthGuard} from "../services/AuthGuard";

export const routes: Routes = [
  { path: ':organizationId/:patrollerIdentifier', component: LoginPageComponent },
  { path: ':organizationId', component: LoginPageComponent },
  // { path: 'login', component: LoginPageComponent },
  { path: '', component: HomePageComponent, canActivate: [AuthGuard] },
];
