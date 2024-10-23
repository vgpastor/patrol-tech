import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-permissions-handler',
  template: `
    <button mat-raised-button color="primary" (click)="checkAndRequestPermissions()" *ngIf="!arePermissionsGranted">
      Solicitar permisos
    </button>
  `,
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule
    ]
})
export class PermissionsHandlerComponent {
  @Output() permissionsGranted = new EventEmitter<boolean>();

  private isCameraPermissionGranted = false;
  private isLocationPermissionGranted = false;

  constructor(private snackBar: MatSnackBar) {}

  get arePermissionsGranted(): boolean {
    return this.isCameraPermissionGranted && this.isLocationPermissionGranted;
  }

  async checkAndRequestPermissions() {
    await this.requestCameraPermission();
    await this.requestLocationPermission();

    if (this.arePermissionsGranted) {
      this.permissionsGranted.emit(true);
    } else {
      this.snackBar.open('Se requieren permisos de cámara y ubicación para continuar', 'Cerrar', { duration: 5000 });
    }
  }

  private async requestCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      this.isCameraPermissionGranted = true;
    } catch (err) {
      console.error("Error al solicitar permisos de cámara:", err);
      this.snackBar.open("Se requiere permiso de cámara", "Cerrar", { duration: 5000 });
    }
  }

  private async requestLocationPermission() {
    try {
      await this.getCurrentPosition();
      this.isLocationPermissionGranted = true;
    } catch (err) {
      console.error("Error al solicitar permisos de ubicación:", err);
      this.snackBar.open("Se requiere permiso de ubicación", "Cerrar", { duration: 5000 });
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
}
