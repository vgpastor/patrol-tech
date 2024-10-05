import {IAuthService} from "../domain/IAuthService";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { v4 as uuidv4 } from 'uuid';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService{
  private apiUrl = environment.apiServer+'/api/auth';

  constructor(private http: HttpClient) { }

  authenticate(email: string, password:string):Observable<any>
    {
        return this.http.post(
          `${this.apiUrl}/login`,
          {email, password}
        );
    }

    logout(){
        console.log('Logging out user');
    }

    register(userId: string, name: string, email: string): Observable<any>
    {
        return this.http.post(
          `${this.apiUrl}/register`,
          {id: userId, name, email}
        );
    }

    registerOrganization(userId:string, type: string, name: string, address: string): Observable<any>
    {
        return this.http.put(
          `${this.apiUrl}/register/${userId}/organization`,
          {type, name, address}
        );
    }

    registerPatrollers(userId: string, organizationId: string, patrollers: any[]): Observable<any>
    {
        return this.http.put(
          `${this.apiUrl}/register/${organizationId}/patrollers`,
          {
            userId,
            patrollers
          }
        );
    }
    registerCheckpoints(userId: string, locationId: string, checkpoints: any[]): Observable<any>
    {
      return this.http.put(
        `${this.apiUrl}/register/${locationId}/checkpoints`,
        {
          userId,
          checkpoints
        }
      );
    }
}
