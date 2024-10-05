import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {DeviceInfo} from "../domain/DeviceInfo";
import {Checkpoint} from "../domain/Checkpoint";
import {ScanServicesInterface} from "../domain/ScanServicesInterface";
import {Scan} from "../domain/Scan";
import {environment} from "../../environments/environment";

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

  getCheckpoints(): Observable<Checkpoint[]> {
    return this.http.get<Checkpoint[]>(`${this.apiUrl}/checkpoints`);
  }

  getScans(): Observable<Scan[]> {
    return this.http.get<any[]>(`${this.apiUrl}/scans`).pipe(
      map(scans => scans.map(scan => ({
        ...scan,
        deviceInfo: typeof scan.deviceInfo === 'string' ? JSON.parse(scan.deviceInfo) : scan.deviceInfo
      })))
    );
  }
}
