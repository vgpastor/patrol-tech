import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {interval, Subscription, switchMap} from "rxjs";
import {DatePipe, NgForOf} from "@angular/common";
import {ApiScanService} from "../../services/shared/infrastructure/ApiScanService";
import {ScanServicesInterface} from "../../services/shared/domain/ScanServicesInterface";
import {Scan} from "../../services/shared/domain/Scan";

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
      (passings:any) => {
        this.recentScans = passings;
      },
      (error:any) => {
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


