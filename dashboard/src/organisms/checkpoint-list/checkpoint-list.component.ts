import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiScanService } from "../../services/shared/infrastructure/ApiScanService";
import { Checkpoint } from "../../services/dashboard/domain/Checkpoint";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { CommonModule } from '@angular/common';
import { MatChipsModule} from "@angular/material/chips";
import { MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-checkpoint-list',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './checkpoint-list.component.html',
  styleUrl: './checkpoint-list.component.scss'
})
export class CheckpointListComponent implements OnInit {
  title = 'Checkpoint List';

  displayedColumns: string[] = ['name', 'description', 'status'];
  dataSource: MatTableDataSource<Checkpoint> = new MatTableDataSource<Checkpoint>([]);

  constructor(
    private scanService: ApiScanService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCheckpoints();
  }

  loadCheckpoints() {
    this.scanService.getCheckpoints().subscribe({
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
