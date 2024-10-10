import {Observable} from "rxjs";
import {JwtPayload} from "./JwtPayload";

export interface IAuthService {
  authenticate(email: string, password: string): Observable<any>

  logout():void

  register(userId: string, name: string, email: string): Observable<any>

  isAuthenticated(): boolean

  setToken(token: string): void

  getToken(): string | null

  removeToken(): void

  getPayload(): JwtPayload

  recoverPassword(email: string): Observable<any>
}
