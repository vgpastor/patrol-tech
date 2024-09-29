export interface Scan {
  id: string; // UUID
  tag: string;
  readAt: string; // ISO date string
  userId: string;
  deviceInfo: {
    // Asumiendo una estructura básica para deviceInfo, ajusta según tus necesidades
    batteryLevel?: number;
    batteryStatus?: string;
    deviceName?: string;
    userAgent?: string;
    geolocation?: {
      latitude: number;
      longitude: number;
    } | null;
    connectionType?: string;
    connectionDownlink?: number;
    // Agrega más propiedades según lo que incluya tu deviceInfo
  };
  timestamp: string; // ISO date string
}
