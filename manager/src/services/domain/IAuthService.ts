import {Observable} from "rxjs";

export interface IAuthService{
  authenticate(email: string, password:string):Observable<any>;
  logout(): void;
  register(id: string, name: string, email: string): Observable<any>
  registerOrganization(id:string, type: string, name: string, address: string): Observable<any>
  registerPatrollers(userId: string, organizationId: string, patrollers: any[]): Observable<any>
  registerCheckpoints(userId: string, locationId: string, checkpoints: any[]): Observable<any>
}
