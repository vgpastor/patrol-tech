export interface DeviceInfo {
  id: string;
  tag: string;
  readAt: string;
  userId: string;
  deviceInfo: {
    batteryLevel: number;
    batteryStatus: string;
    deviceName: string;
    userAgent: string;
    geolocation: {
      latitude: number;
      longitude: number;
    } | null;
    connectionType: string;
    connectionDownlink: number;
  };
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}
