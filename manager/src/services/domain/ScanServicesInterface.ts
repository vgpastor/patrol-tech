import {Observable} from "rxjs";
import {DeviceInfo} from "./DeviceInfo";
import {Checkpoint} from "./Checkpoint";
import {Scan} from "./Scan";

export interface ScanServicesInterface{

  getDevices(): Observable<DeviceInfo[]>

  getDeviceById(id: string): Observable<DeviceInfo>

  getCheckpoints(): Observable<Checkpoint[]>

  getScans(): Observable<Scan[]>

}
