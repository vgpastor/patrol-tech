import {Geolocation} from "./Geolocation";

export class DeviceInfo{
  public batteryLevel: number;
  public batteryStatus: string;
  public deviceName: string;
  public userAgent: string;
  public geolocation: Geolocation | null;
  public connectionType: string;
  public connectionDownlink: number;

  constructor(
    batteryLevel: number, batteryStatus: string, deviceName: string, userAgent: string, geolocation: Geolocation | null, connectionType: string, connectionDownlink: number) {
    this.batteryLevel = batteryLevel;
    this.batteryStatus = batteryStatus;
    this.deviceName = deviceName;
    this.userAgent = userAgent;
    this.geolocation = geolocation;
    this.connectionType = connectionType;
    this.connectionDownlink = connectionDownlink;
  }

  setBattery(battery: any){
    this.batteryLevel = battery.level;
    this.batteryStatus = battery.charging ? "Charging" : "Not Charging";
  }

  setConnection(effectiveType: any, connectionDownlink: number){
    this.connectionType = effectiveType;
    this.connectionDownlink = connectionDownlink;
  }

}
