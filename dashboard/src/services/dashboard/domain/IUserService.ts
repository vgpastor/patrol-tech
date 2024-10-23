import {Observable} from "rxjs";

export interface IUserService {
  registerOrganization(userId: string, type: string, name: string, address: string): Observable<any>

  registerPatrollers(userId: string, organizationId: string, patrollers: any[]): Observable<any>

  registerCheckpoints(userId: string, locationId: string, checkpoints: any[]): Observable<any>
}
