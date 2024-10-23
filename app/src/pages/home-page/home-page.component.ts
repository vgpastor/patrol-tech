import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceInfoService } from '../../services/DeviceInfoService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, Subscription } from 'rxjs';
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {NgClass, NgIf} from "@angular/common";
import {QrScannerComponent} from "../../components/qr-scanner.component";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    QrScannerComponent,
    NgIf,
    MatIconModule,
    NgClass
  ]
})
export class HomePageComponent implements OnInit, OnDestroy {
  permissionsGranted = false;
  private permissionsSubscription: Subscription | undefined;

  constructor(
    private deviceInfoService: DeviceInfoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.requestPermissions();
    this.permissionsSubscription = combineLatest([
      this.deviceInfoService.getCameraPermissionStatus(),
      this.deviceInfoService.getLocationPermissionStatus()
    ]).subscribe(([cameraPermission, locationPermission]) => {
      this.permissionsGranted = cameraPermission && locationPermission;
    });
  }

  ngOnDestroy() {
    if (this.permissionsSubscription) {
      this.permissionsSubscription.unsubscribe();
    }
  }

  async requestPermissions() {
    const cameraPermission = await this.deviceInfoService.requestCameraPermission();
    const locationPermission = await this.deviceInfoService.requestLocationPermission();

    if (!cameraPermission || !locationPermission) {
      this.snackBar.open("Se requieren permisos de cámara y ubicación para usar el escáner", "Cerrar", { duration: 5000 });
    }
  }

  logout() {

  }
}
