import {IUserService} from "../domain/IUserService";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {IAuthService} from "../../auth/domain/IAuthService";
import {Inject, Injectable} from "@angular/core";
import {ApiAuthService} from "../../auth/infrastructure/ApiAuthService";

@Injectable({
  providedIn: 'root'
})
export class ApiUserService implements IUserService{
  private apiUrl = environment.apiServer+'/api';

  constructor(
    @Inject(ApiAuthService) private authService: IAuthService,
    private http: HttpClient
  ) {
  }

  registerOrganization(userId:string, type: string, name: string, address: string): Observable<any>
  {
    return this.http.put(
      `${this.apiUrl}/organization`,
      {type, name, address}
    );
  }

  registerPatrollers(userId: string, organizationId: string, patrollers: any[]): Observable<any>
  {
    return this.http.put(
      `${this.apiUrl}/organization/${organizationId}/patrollers`,
      {
        userId,
        patrollers
      }
    );
  }
  registerCheckpoints(userId: string, locationId: string, checkpoints: any[]): Observable<any>
  {
    return this.http.put(
      `${this.apiUrl}/location/${locationId}/checkpoints`,
      {
        userId,
        checkpoints
      }
    );
  }

}
