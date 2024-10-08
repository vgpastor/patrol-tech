import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {Html5Qrcode} from "html5-qrcode";
import {MatButton} from "@angular/material/button";
import {CommonModule, NgIf} from "@angular/common";
import {Geolocation} from "../../models/Geolocation";
import {DeviceInfo} from "../../models/DeviceInfo";
import { DeviceDetectorService } from 'ngx-device-detector';
import {ReadService} from "../../ReadService";
import {TagRead} from "../../models/TagRead";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MatSnackBarModule,
    CommonModule,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatButton,
    NgIf
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  geolocation: Geolocation | undefined;

  deviceInfo: DeviceInfo;

  lastCodeReaded: string = "";

  constructor(
    private deviceService: DeviceDetectorService,
    private readService: ReadService,
    private snac: MatSnackBar
  ) {
    var deviceServiceInfo = this.deviceService.getDeviceInfo();
    this.deviceInfo = new DeviceInfo(0, "", deviceServiceInfo.device, deviceServiceInfo.userAgent, null, "", 100);
  }

  showStartButton: boolean = true;


  startQrCodeScanner() {
    this.showStartButton = false;
    this.getGeolocation();
    this.getDeviceInfo();

    var html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,    // Optional, frame per seconds for qr code scanning
        qrbox: 250,  // Optional, if you want bounded box UI
      },
      qrCodeMessage => {
        if (this.lastCodeReaded == qrCodeMessage) {
          return;
        }
        this.lastCodeReaded = qrCodeMessage;
        console.log(`QR Code detected: ${qrCodeMessage}`);
        this.snac.open(`QR Code detected: ${qrCodeMessage}`, "Cerrar",{})
        this.saveReadTag(qrCodeMessage);
        // const truncatedMessage = truncateText(qrCodeMessage, 30); // Truncate the QR code message to 30 characters
        // document.querySelector("#qr-reader-result").textContent = truncatedMessage; // Display truncated QR code
      },
      errorMessage => {
        // Handle errors
        // console.error(errorMessage);
      })
      .catch(err => {
        // Start failed, handle it
        console.error("QR Code Scanner initialization failed: ", err);
      });
  }

  getGeolocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Éxito: se obtuvo la posición
        this.geolocation = new Geolocation(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.altitude,
          position.coords.accuracy
        );
        this.deviceInfo.geolocation = this.geolocation;

        // Programar la próxima actualización
        setTimeout(() => {
          this.getGeolocation();
        }, 2000);
      },
      (error) => {
        // Error: no se pudo obtener la posición
        console.error("Error getting geolocation:", error);

        let message = "";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = "El usuario ha denegado el permiso para acceder a la ubicación.";
            this.snac.open("Es necesaria la ubicación para poder capturar los códigos", "Cerrar", {});
            this.showStartButton = true;
            break;
          case error.POSITION_UNAVAILABLE:
            message = "La información de ubicación no está disponible. El GPS podría estar apagado.";
            break;
          case error.TIMEOUT:
            message = "Se ha agotado el tiempo de espera para obtener la ubicación.";
            break;
          default:
            message = "Ha ocurrido un error desconocido al obtener la ubicación.";
        }
        console.error("GPS Error:", message);

        // Mostrar notificación al usuario
        this.snac.open("Es necesaria la ubicación para poder capturar los códigos", "Cerrar", {
          duration: 5000
        });


        // Intentar de nuevo después de un tiempo
        setTimeout(() => {
          this.getGeolocation();
        }, 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  async getDeviceInfo() {
      // @ts-ignore
    navigator.getBattery().then((battery) => {
      this.deviceInfo.setBattery(battery);
      console.debug("Set Battery", this.deviceInfo);
      battery.addEventListener('levelchange', () => {
        this.deviceInfo.setBattery(battery);
        console.debug("Battery updated", this.deviceInfo);
      });
    });
    // @ts-ignore
    const connection = navigator.connection;
    if (connection) {
      this.deviceInfo.setConnection(connection.effectiveType, connection.downlink);
      console.debug("Connection  updated", this.deviceInfo, connection);
      connection.addEventListener('change', () => {
        this.deviceInfo.setConnection(connection.effectiveType, connection.downlink);
        console.debug("Connection  updated", this.deviceInfo, connection);
      });
    }
  }

  saveReadTag(tag: string) {
    const data = new TagRead(tag, new Date(), "user", this.deviceInfo);
    this.readService.saveData(data);
    this.snac.open("Código Guardado", "Cerrar", {});
  }

}
