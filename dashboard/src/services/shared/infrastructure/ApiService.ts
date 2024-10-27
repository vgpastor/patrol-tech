import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from "../../../environments/environment";
import {Patroller} from "../../dashboard/domain/Patroller";
import {ApiServicesInterface} from "../domain/ApiServiceInterface";
import {ApiResponse} from "./ApiResponse";
import {User} from "../domain/User";

@Injectable({
  providedIn: 'root'
})
export class ApiService implements ApiServicesInterface{
  private readonly apiUrl = environment.apiServer+'/api';

  constructor(private readonly http: HttpClient) { }

  addPatroller(patroller: Patroller): Observable<Patroller> {
    return this.http.post<Patroller>(`${this.apiUrl}/patrollers`, patroller);
  }

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`);
  }

  addUser(updatedUser: User): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users`, updatedUser);
  }
}
