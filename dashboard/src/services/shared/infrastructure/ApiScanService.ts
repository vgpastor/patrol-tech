import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {DeviceInfo} from "../domain/DeviceInfo";
import {ScanServicesInterface} from "../domain/ScanServicesInterface";
import {Scan} from "../domain/Scan";
import {environment} from "../../../environments/environment";
import {Checkpoint} from "../../dashboard/domain/Checkpoint";
import {ApiResponse} from "./ApiResponse";
import {Patroller} from "../../dashboard/domain/Patroller";
import {ScanList} from "../domain/ScanList";

@Injectable({
  providedIn: 'root'
})
export class ApiScanService implements ScanServicesInterface{
  private apiUrl = environment.apiServer+'/api';

  constructor(private http: HttpClient) { }

  getDevices(): Observable<DeviceInfo[]> {
    return this.http.get<DeviceInfo[]>(`${this.apiUrl}/devices`);
  }

  getDeviceById(id: string): Observable<DeviceInfo> {
    return this.http.get<DeviceInfo>(`${this.apiUrl}/devices/${id}`);
  }

  getCheckpoints(): Observable<ApiResponse<Checkpoint[]>> {
    return this.http.get<ApiResponse<Checkpoint[]>>(`${this.apiUrl}/checkpoints`);
  }

  getRecentScans(): Observable<ApiResponse<ScanList[]>> {
    return this.http.get<ApiResponse<ScanList[]>>(`${this.apiUrl}/scans`);
  }

  getScansList(page: number, limit: number, patroller? : string | null, checkpoint?: string | null): Observable<ApiResponse<ScanList[]>> {
    return this.http.get<ApiResponse<ScanList[]>>(`${this.apiUrl}/scans?page=${page}&limit=${limit}&patroller=${patroller}&checkpoint=${checkpoint}`);
  }

  getPatrollers(): Observable<ApiResponse<Patroller[]>> {
    return this.http.get<ApiResponse<Patroller[]>>(`${this.apiUrl}/patrollers`);
  }

  getOrganizationsById(id: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/organization/list?ids=${id}`);
  }
}
