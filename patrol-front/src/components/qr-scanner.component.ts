import {Component, OnDestroy, OnInit} from '@angular/core';
import {CameraDevice, Html5Qrcode} from "html5-qrcode";
import { MatSnackBar } from "@angular/material/snack-bar";
import {PermissionsHandlerComponent} from "./PermissionsHandlerComponent";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf, SlicePipe} from "@angular/common";
import {ReadService} from "../services/ReadService";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
  standalone: true,
  imports: [
    PermissionsHandlerComponent,
    MatButtonModule,
    NgIf,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    SlicePipe,
    NgForOf,
    MatIcon,
  ]
})
export class QrScannerComponent implements OnDestroy, OnInit {
  private html5QrCode: Html5Qrcode | null = null;
  isScanning = false;
  canScan = true;
  lastScannedCode = '';
  cameras: CameraDevice[] = [];
  selectedCamera: string | null = null;
  hasFlash = false;
  isFlashOn = true;
  private stream: MediaStream | null = null;

  constructor(
    private readService: ReadService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.getCameras();
    this.selectedCamera = localStorage.getItem("selectedCamera")
    if (this.selectedCamera !== null) {
      this.startQrCodeScanner();
    }else if (this.cameras.length > 0) {
      this.selectedCamera = this.cameras[this.cameras.length-1].id;
      this.startQrCodeScanner();
    }
  }

  ngOnDestroy() {
    this.stopQrCodeScanner();
  }

  async getCameras() {
    try {
      this.cameras = await Html5Qrcode.getCameras();
    } catch (err) {
      console.error("Error getting cameras", err);
      this.snackBar.open("Error al obtener las cámaras", "Cerrar");
    }
  }

  onCameraChange() {
    if (this.selectedCamera === null) {
      return
    }
    localStorage.setItem("selectedCamera", this.selectedCamera);
    this.stopQrCodeScanner();
    this.startQrCodeScanner();
  }

  async startQrCodeScanner() {
    if (!this.canScan || this.selectedCamera === null) {
      this.snackBar.open("Se requieren permisos para escanear códigos QR", "Cerrar", { duration: 5000 });
      return;
    }
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: this.selectedCamera }
    });

    const track = this.stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();

    this.hasFlash = 'torch' in capabilities;


    this.html5QrCode = new Html5Qrcode("qr-reader");

    this.html5QrCode.start(
      {
        deviceId: this.selectedCamera
      },
      {
        fps: 10,
        qrbox: 250,
      },
      this.onQrCodeDetected.bind(this),
      this.onQrCodeError.bind(this)
    ).then(() => {
      this.isScanning = true;
    }).catch((err) => {
      console.error("QR Code Scanner initialization failed: ", err);
      this.snackBar.open("Error al iniciar el escáner de códigos QR", "Cerrar");
    });
  }

  private onQrCodeDetected(qrCodeMessage: string) {
    if (this.lastScannedCode === qrCodeMessage) {
      return;
    }
    this.lastScannedCode = qrCodeMessage;
    this.readService.saveReadTag(qrCodeMessage).subscribe({
      next: (resp) => {
        if (!resp) {
          console.error("Error saving tag read");
          this.snackBar.open("Error saving tag read", "Aceptar");
          return;
        }
        this.snackBar.open("Tag read saved successfully", "Aceptar");
      },
      error: (err) => {
        console.error("Error saving tag read:", err);
        this.snackBar.open("Error saving tag read", "Aceptar");
      }
    })
  }

  private onQrCodeError(errorMessage: string) {
    // Handle errors if needed
  }

  private stopQrCodeScanner() {
    if (this.html5QrCode) {
      this.html5QrCode.stop().catch(err => console.error("Error stopping QR Code scanner:", err));
      this.html5QrCode = null;
      this.isScanning = false;
    }
  }

  async toggleFlash() {
    if (!this.stream) return;

    const track = this.stream.getVideoTracks()[0];

    const constraints = { advanced: [{ torch: this.isFlashOn } as any] };

    try {
      await track.applyConstraints(constraints);
      this.isFlashOn = !this.isFlashOn;
    } catch (err) {
      console.error("Error toggling flash:", err);
      this.snackBar.open("No se pudo controlar el flash", "Cerrar");
    }
  }

}
