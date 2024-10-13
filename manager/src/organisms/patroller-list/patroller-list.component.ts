import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
export class PatrollerListComponent implements OnInit {
  title = 'Patroller List';

  displayedColumns: string[] = ['identifier', 'name', 'status'];
  dataSource: MatTableDataSource<Patroller> = new MatTableDataSource<Patroller>([]);

  constructor(
    private scanService: ApiScanService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCheckpoints();
  }

  loadCheckpoints() {
    this.scanService.getPatrollers().subscribe({
      next: (checkpoints) => {
        this.dataSource.data = checkpoints.results;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching checkpoints:', error);
        // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    });
  }
}
