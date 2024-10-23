export interface Geolocation{
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export class DeviceInfo {
  constructor(
    public batteryLevel: number,
    public batteryStatus: string,
    public deviceName: string,
    public userAgent: string,
    public geolocation: Geolocation | null,
    public connectionType: string,
    public connectionDownlink: number
  ) {}

  setBattery(battery: any) {
    this.batteryLevel = battery.level * 100;
    this.batteryStatus = battery.charging ? 'charging' : 'discharging';
  }

  setConnection(type: string, downlink: number) {
    this.connectionType = type;
    this.connectionDownlink = downlink;
  }
}
