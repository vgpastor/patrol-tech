import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {Html5Qrcode} from "html5-qrcode";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {Geolocation} from "../../models/Geolocation";
import {DeviceInfo} from "../../models/DeviceInfo";
import { DeviceDetectorService } from 'ngx-device-detector';
import {ReadService} from "../../ReadService";
import {TagRead} from "../../models/TagRead";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
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
    private readService: ReadService
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
    navigator.geolocation.getCurrentPosition((position) => {
      this.geolocation = new Geolocation(position.coords.latitude, position.coords.longitude, position.coords.altitude, position.coords.accuracy);
      this.deviceInfo.geolocation = this.geolocation;
      console.debug("Geolocation updated", this.deviceInfo);
      setTimeout(() => {
        this.getGeolocation();
      },2000);
    });
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
  }

}
