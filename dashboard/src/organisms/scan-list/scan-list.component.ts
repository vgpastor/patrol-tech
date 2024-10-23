import { Component, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { interval, Subscription, switchMap } from "rxjs";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import { ApiScanService } from "../../services/shared/infrastructure/ApiScanService";
import { ScanServicesInterface } from "../../services/shared/domain/ScanServicesInterface";
import { Scan } from "../../services/shared/domain/Scan";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import { MatIcon } from "@angular/material/icon";
import { Patroller } from "../../services/dashboard/domain/Patroller";
import { ScanList } from "../../services/shared/domain/ScanList";
import { MatTooltip, MatTooltipModule } from "@angular/material/tooltip";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import {ApiResponse} from "../../services/shared/infrastructure/ApiResponse";
import {Checkpoint} from "../../services/dashboard/domain/Checkpoint";

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
    MatTooltipModule,
    MatPaginator,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './scan-list.component.html',
  styleUrl: './scan-list.component.scss'
})
export class ScanListComponent implements OnInit, OnDestroy, OnChanges {
  scans: ScanList[] = [];
  @Input() brief: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public page: number = 1;
  public limit: number = 10;

  private updateSubscription!: Subscription;

  displayedColumns: string[] = ['name', 'patroller', 'date'];
  dataSource: MatTableDataSource<ScanList> = new MatTableDataSource<ScanList>([]);

  checkpointFilter = new FormControl('');
  patrollerFilter = new FormControl('');

  checkpoints: Checkpoint[] = [];
  patrollers: Patroller[] = [];
  totalScans: number = 0;

  constructor(
    @Inject(ApiScanService) private scanService: ScanServicesInterface
  ) {}

  ngOnInit(): void {
    this.updateFilters()
    this.dataSource.paginator = this.paginator;
    this.loadScans();

    this.checkpointFilter.valueChanges.subscribe(() => this.onFiltersChanged());
    this.patrollerFilter.valueChanges.subscribe(() => this.onFiltersChanged());
  }

  ngOnChanges(): void {
    if (this.scans.length > 0) {
      this.updateDataSource(this.scans);
      this.stopRealtimeUpdates();
    }
  }

  ngOnDestroy(): void {
    this.stopRealtimeUpdates();
  }

  private loadScans(): void {
    const checkpoint = this.checkpointFilter.value || null;
    const patroller = this.patrollerFilter.value || null;

    this.scanService.getScansList(this.page, this.limit, patroller, checkpoint)
      .subscribe(this.handleScansUpdate.bind(this));
  }

  private handleScansUpdate(response: ApiResponse<ScanList[]>): void {
    this.updateDataSource(response.results);
    this.totalScans = response.count;
  }

  private updateDataSource(scans: ScanList[]): void {
    this.dataSource.data = scans;
    // this.updateFilters(scans);
  }

  private updateFilters(): void {
    this.scanService.getCheckpoints().subscribe({
      next: (checkpoints) => {
        this.checkpoints = checkpoints.results;
      }
    })
    this.scanService.getPatrollers().subscribe({
      next: (patrollers) => {
        this.patrollers = patrollers.results;
      }
    });
  }

  onFiltersChanged(): void {
    this.page = 1;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadScans();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadScans();
  }

  private stopRealtimeUpdates(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}
