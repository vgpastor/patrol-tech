import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {IAuthService} from "../domain/IAuthService";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "../domain/JwtPayload";

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService implements IAuthService{
  private readonly TOKEN_KEY = 'auth_token';

  private token: string | null = null;

  private apiUrl = environment.apiServer+'/api/auth';

  constructor(private http: HttpClient) { }

  authenticate(email: string, password:string):Observable<any>
  {
    return this.http.post(
      `${this.apiUrl}/login`,
      {email, password}
    ).pipe(tap({
      next: (data:any) => {
        this.setToken(data.token);
      },
      error: (error:any) => {
        console.error('Error authenticating user', error);
      }
    }))
  }

  logout()
  {
    console.log('Logging out user');
  }

  register(userId: string, name: string, email: string): Observable<any>
  {
    return this.http.post(
      `${this.apiUrl}/register`,
      {id: userId, name, email}
    ).pipe(tap({
      next: (data:any) => {

        this.setToken(data);
      },
      error: (error:any) => {
        console.error('Error authenticating user', error);
      }
    }))
  }

  isAuthenticated(): boolean
  {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      if (!decodedToken || !decodedToken.exp) {
        return false;
      }

      // Verifica la expiración del token
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate > new Date();

    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return false;
    }
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    if (this.token) return this.token;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    this.token = null;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getPayload(): JwtPayload
  {
    const token = this.getToken();
    if (!token) throw new Error('Token not found');

    const decodedToken = jwtDecode<JwtPayload>(token);
    if (!decodedToken) throw new Error('Invalid token');
    return decodedToken;
  }

  recoverPassword(email: string): Observable<any>
  {
    return this.http.post(
      `${this.apiUrl}/recover-password`,
      {email}
    ).pipe(tap({
      next: (data:any) => {
        console.log('Password recovery email sent', data);
      },
      error: (error:any) => {
        console.error('Error sending password recovery email', error);
      }
    }))
  }



}
