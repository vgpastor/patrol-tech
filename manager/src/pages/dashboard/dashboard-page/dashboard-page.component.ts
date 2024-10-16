import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {CheckpointListComponent} from "../../../organisms/checkpoint-list/checkpoint-list.component";
import {PatrollerListComponent} from "../../../organisms/patroller-list/patroller-list.component";
import {ScanListComponent} from "../../../organisms/scan-list/scan-list.component";
import {ModalService} from "../../../organisms/modal/ModalService";
import {FormPatrollerComponent} from "../../../organisms/form-patroller/form-patroller.component";
import {Patroller} from "../../../services/dashboard/domain/Patroller";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ApiScanService} from "../../../services/shared/infrastructure/ApiScanService";

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    ScanListComponent,
    MatCardModule,
    MatIcon,
    CheckpointListComponent,
    PatrollerListComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {

  public patrollers: Patroller[] = [];

  constructor(
    private modalService: ModalService,
    private snackBar: MatSnackBar,
    private readonly scanService: ApiScanService,
  ) {}

  ngOnInit() {
    this.loadPatrollers();
  }

  addPatroller() {
    const dialogRef = this.modalService.openModal(FormPatrollerComponent, {
      title: 'Add Patroller',
      organizationId: 'pepe'
    });

    dialogRef.afterClosed().subscribe((patroller: Patroller) => {
      if(patroller == null) {
        return;
      }
      this.patrollers.push(patroller);
      this.patrollers = [...this.patrollers];
      this.snackBar.open('Patroller added successfully', 'Close', { duration: 3000 });
    });

    dialogRef.componentInstance.save.subscribe((updatedPatroller: Patroller) => {
      console.log('Patroller updated:', updatedPatroller);
      this.snackBar.open('Patroller updated successfully', 'Close', { duration: 3000 });
      // dialogRef.close();
      // dialogRef.
    });

    dialogRef.componentInstance.cancel.subscribe((resp) => {
      console.log('Cancel:', resp);
      // dialogRef.close();
    });
  }

  loadPatrollers() {
    this.scanService.getPatrollers().subscribe({
      next: (response) => {
        this.patrollers = response.results
      },
      error: (error) => {
        console.error('Error fetching Patrollers:', error);
      }
    });
  }
}
