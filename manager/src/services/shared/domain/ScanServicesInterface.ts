import {Observable} from "rxjs";
import {DeviceInfo} from "./DeviceInfo";
import {Scan} from "./Scan";
import {Checkpoint} from "../../dashboard/domain/Checkpoint";

export interface ScanServicesInterface{

  getDevices(): Observable<DeviceInfo[]>

  getDeviceById(id: string): Observable<DeviceInfo>

  getCheckpoints(): Observable<Checkpoint[]>

  getScans(): Observable<Scan[]>

}
