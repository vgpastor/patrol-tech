import {inject, Inject, Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpInterceptorFn} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {IAuthService} from "../domain/IAuthService";
import {ApiAuthService} from "./ApiAuthService";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(ApiAuthService);
  const token = authService.getToken();

  if (token && !req.url.includes('/auth/')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
      }

      return throwError(() => error);
    }));
};
