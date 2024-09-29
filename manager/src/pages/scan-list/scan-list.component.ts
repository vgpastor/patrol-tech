import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Checkpoint} from "../../services/domain/Checkpoint";
import {DeviceInfo} from "../../services/domain/DeviceInfo";
import {interval, Subscription, switchMap} from "rxjs";
import {ScanServicesInterface} from "../../services/domain/ScanServicesInterface";
import {ApiScanService} from "../../services/infrastructure/ApiScanService";
import {DatePipe, NgForOf} from "@angular/common";
import {Scan} from "../../services/domain/Scan";

@Component({
  selector: 'app-scan-list',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf
  ],
  templateUrl: './scan-list.component.html',
  styleUrl: './scan-list.component.scss'
})
export class ScanListComponent implements OnInit, OnDestroy {
  recentScans: Scan[] = [];
  private updateSubscription!: Subscription;

  constructor(
    @Inject(ApiScanService) private deviceService: ScanServicesInterface
  ) { }

  ngOnInit(): void {
    this.startRealtimeUpdates();
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private startRealtimeUpdates(): void {
    this.deviceService.getScans().subscribe(
      (passings) => {
        this.recentScans = passings;
      },
      (error) => {
        console.error('Error fetching recent passings', error);
      }
    );
    this.updateSubscription = interval(5000) // Update every 5 seconds
      .pipe(
        switchMap(() => this.deviceService.getScans())
      )
      .subscribe(
        (passings) => {
          this.recentScans = passings;
        },
        (error) => {
          console.error('Error fetching recent passings', error);
        }
      );
  }
}


