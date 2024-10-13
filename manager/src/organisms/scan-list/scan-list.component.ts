import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {interval, Subscription, switchMap} from "rxjs";
import {DatePipe, NgForOf} from "@angular/common";
import {ApiScanService} from "../../services/shared/infrastructure/ApiScanService";
import {ScanServicesInterface} from "../../services/shared/domain/ScanServicesInterface";
import {Scan} from "../../services/shared/domain/Scan";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {Patroller} from "../../services/dashboard/domain/Patroller";
import {ScanList} from "../../services/shared/domain/ScanList";
import {MatTooltip, MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-scan-list',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatNoDataRow,
    MatTooltipModule
  ],
  templateUrl: './scan-list.component.html',
  styleUrl: './scan-list.component.scss'
})
export class ScanListComponent implements OnInit, OnDestroy {
  recentScans: ScanList[] = [];
  private updateSubscription!: Subscription;

  displayedColumns: string[] = ['name', 'patroller', 'date'];
  dataSource: MatTableDataSource<ScanList> = new MatTableDataSource<ScanList>([]);

  constructor(
    @Inject(ApiScanService) private deviceService: ScanServicesInterface
  ) {}

  ngOnInit(): void {
    this.startRealtimeUpdates();
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private startRealtimeUpdates(): void {
    this.deviceService.getRecentScans().subscribe({
      next: (passings) => {
        this.recentScans = passings;
        this.dataSource.data = passings;
      },
      error: (error) => {
        console.error('Error fetching recent passings:', error);
      }
    });
    this.updateSubscription = interval(5000) // Update every 5 seconds
      .pipe(
        switchMap(() => this.deviceService.getRecentScans())
      )
      .subscribe({
          next: (passings) => {
            this.recentScans = passings;
            this.dataSource.data = passings;
          },
          error: (error) => {
            console.error('Error fetching recent passings:', error);
          }
        }
      );
  }

}


