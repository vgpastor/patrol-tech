import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import {Organization} from "../models/Organization";
import {Patroller} from "../models/Patroller";
import {Checkpoint} from "../models/Checkpoint";

interface OrganizationLoginResponse {
  organization: Organization | null;
  fastAuth: boolean;
  patrollers?: Patroller[];
  checkpoints?: Checkpoint[];
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  constructor(private http: HttpClient) {}

  verifyOrganization(organizationId: string): Observable<OrganizationLoginResponse> {
    return this.http.post<OrganizationLoginResponse>(`${environment.apiServer}/api/auth/app`,{
      organizationId
    })
      .pipe(
        catchError(error => {
          console.error('Error verifying organization:', error);
          return of({ organization: null, fastAuth: false });
        })
      );
  }
}
