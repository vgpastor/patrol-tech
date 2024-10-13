import {Observable} from "rxjs";
import {DeviceInfo} from "./DeviceInfo";
import {Scan} from "./Scan";
import {Checkpoint} from "../../dashboard/domain/Checkpoint";
import {ApiResponse} from "../infrastructure/ApiResponse";
import {Patroller} from "../../dashboard/domain/Patroller";
import {ScanList} from "./ScanList";

export interface ScanServicesInterface{

  getDevices(): Observable<DeviceInfo[]>

  getDeviceById(id: string): Observable<DeviceInfo>

  getCheckpoints(): Observable<ApiResponse<Checkpoint[]>>

  getRecentScans(): Observable<ScanList[]>

  getPatrollers(): Observable<ApiResponse<Patroller[]>>

  getOrganizationsById(id: string): Observable<any>

}
