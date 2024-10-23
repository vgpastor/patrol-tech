import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatCard, MatCardAvatar, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {ScanListComponent} from "../../../organisms/scan-list/scan-list.component";
import {ScanList} from "../../../services/shared/domain/ScanList";
import {interval, Subscription, switchMap} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {ApiScanService} from "../../../services/shared/infrastructure/ApiScanService";
import {ScanServicesInterface} from "../../../services/shared/domain/ScanServicesInterface";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-list-scan-page',
  standalone: true,
  imports: [
    MatCard,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    ScanListComponent,
    MatPaginator
  ],
  templateUrl: './list-scan-page.component.html',
  styleUrl: './list-scan-page.component.scss'
})
export class ListScanPageComponent implements OnInit, OnDestroy {
  scans: ScanList[] = [];
  private updateSubscription!: Subscription;
  public page: number = 1;
  public limit: number = 10;

  constructor(
    @Inject(ApiScanService) private deviceService: ScanServicesInterface
  ) {}

  ngOnInit(): void {
    // this.loadScans();
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private loadScans(): void {
    this.deviceService.getScansList(this.page, this.limit).subscribe({
      next: (scans) => {
        this.scans = scans.results;
      },
      error: (error) => {
        console.error('Error fetching recent passings:', error);
      }
    });
  }

  onPageChange($event: PageEvent) {
    this.page = $event.pageIndex;
    this.limit = $event.pageSize;
    this.loadScans();
  }
}
