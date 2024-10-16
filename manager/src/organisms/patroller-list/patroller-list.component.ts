import {Component, OnInit, ChangeDetectorRef, Input, OnChanges} from '@angular/core';
import { ApiScanService } from "../../services/shared/infrastructure/ApiScanService";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { CommonModule } from '@angular/common';
import { MatChipsModule} from "@angular/material/chips";
import { MatIconModule} from "@angular/material/icon";
import {Patroller} from "../../services/dashboard/domain/Patroller";

@Component({
  selector: 'app-patroller-list',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './patroller-list.component.html',
  styleUrl: './patroller-list.component.scss'
})
export class PatrollerListComponent implements OnInit, OnChanges {
  title = 'Patroller List';

  displayedColumns: string[] = ['identifier', 'name', 'status'];
  dataSource: MatTableDataSource<Patroller> = new MatTableDataSource<Patroller>([]);

  @Input() public patrollers: Patroller[] = [];

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataSource.data = this.patrollers
    this.cdr.detectChanges();
  }

  ngOnChanges() {
    this.dataSource.data = this.patrollers
    this.cdr.detectChanges();
  }
}
