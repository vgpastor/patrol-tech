import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import {DeviceInfo, Geolocation} from "../models/DeviceInfo";

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService implements OnDestroy {
  private deviceInfo: DeviceInfo;
  private geolocationWatchId: number | null = null;

  private cameraPermissionGranted = new BehaviorSubject<boolean>(false);
  private locationPermissionGranted = new BehaviorSubject<boolean>(false);

  constructor(private deviceDetectorService: DeviceDetectorService) {
    this.deviceInfo = new DeviceInfo(
      0,
      "",
      "",
      "",
      null,
      "",
      100
    );
    this.initDeviceInfo();
  }

  private initDeviceInfo() {
    const deviceServiceInfo = this.deviceDetectorService.getDeviceInfo();
    this.deviceInfo.deviceName = deviceServiceInfo.device;
    this.deviceInfo.userAgent = deviceServiceInfo.userAgent;
    this.updateDeviceInfo();
  }

  private updateDeviceInfo() {
    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then((battery) => {
        this.deviceInfo.setBattery(battery);
        battery.addEventListener('levelchange', () => {
          this.deviceInfo.setBattery(battery);
        });
      });
    }

    // @ts-ignore
    const connection = navigator.connection;
    if (connection) {
      this.deviceInfo.setConnection(connection.effectiveType, connection.downlink);
      connection.addEventListener('change', () => {
        this.deviceInfo.setConnection(connection.effectiveType, connection.downlink);
      });
    }
  }

  async requestCameraPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      this.cameraPermissionGranted.next(true);
      return true;
    } catch (err) {
      console.error("Error al solicitar permisos de cámara:", err);
      this.cameraPermissionGranted.next(false);
      return false;
    }
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      await this.getCurrentPosition();
      this.locationPermissionGranted.next(true);
      this.startGeolocationWatch();
      return true;
    } catch (err: any) {
      console.error("Error al solicitar permisos de ubicación:", err);
      if(err instanceof GeolocationPositionError && err.code === 3) {
        console.log("Location timeout, requesting permission again");
        await this.getCurrentPosition();
        this.locationPermissionGranted.next(true);
        this.startGeolocationWatch();
        return true;
      }
      this.locationPermissionGranted.next(false);
      return false;
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  }

  private startGeolocationWatch() {
    if ('geolocation' in navigator) {
      this.geolocationWatchId = navigator.geolocation.watchPosition(
        this.onGeolocationSuccess.bind(this),
        this.onGeolocationError.bind(this),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 15000
        }
      );
    }
  }

  private onGeolocationSuccess(position: GeolocationPosition){
    this.deviceInfo.geolocation = {
      timestamp: position.timestamp,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
    };
  }

  private onGeolocationError(error: GeolocationPositionError) {
    console.error("Error getting geolocation:", error);
    this.locationPermissionGranted.next(false);
    // Aquí puedes manejar el error de geolocalización según tus necesidades
  }

  getCameraPermissionStatus(): Observable<boolean> {
    return this.cameraPermissionGranted.asObservable();
  }

  getLocationPermissionStatus(): Observable<boolean> {
    return this.locationPermissionGranted.asObservable();
  }

  getDeviceInfo(): DeviceInfo {
    return new DeviceInfo(
      this.deviceInfo.batteryLevel,
      this.deviceInfo.batteryStatus,
      this.deviceInfo.deviceName,
      this.deviceInfo.userAgent,
      this.deviceInfo.geolocation,
      this.deviceInfo.connectionType,
      this.deviceInfo.connectionDownlink
    );
  }

  ngOnDestroy() {
    if (this.geolocationWatchId !== null) {
      navigator.geolocation.clearWatch(this.geolocationWatchId);
    }
  }
}
