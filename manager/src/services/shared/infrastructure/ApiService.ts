import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {Patroller} from "../../dashboard/domain/Patroller";
import {ApiServicesInterface} from "../domain/ApiServiceInterface";

@Injectable({
  providedIn: 'root'
})
export class ApiService implements ApiServicesInterface{
  private readonly apiUrl = environment.apiServer+'/api';

  constructor(private readonly http: HttpClient) { }

  addPatroller(patroller: Patroller): Observable<Patroller> {
    return this.http.post<Patroller>(`${this.apiUrl}/patrollers`, patroller);
  }

}
