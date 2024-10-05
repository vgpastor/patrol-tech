import {Inject, Injectable} from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {IAuthService} from "../domain/IAuthService";
import {ApiAuthService} from "./ApiAuthService";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(ApiAuthService) private authService: IAuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Redirige al usuario a la página de login si no está autenticado
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url }});
    }
  }
}
