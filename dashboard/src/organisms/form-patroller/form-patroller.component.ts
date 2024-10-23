import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {Patroller} from "../../services/dashboard/domain/Patroller";
import {ApiScanService} from "../../services/shared/infrastructure/ApiScanService";
import {ApiUserService} from "../../services/dashboard/infrastructure/ApiUserService";
import {ApiService} from "../../services/shared/infrastructure/ApiService";
import {v4, v4 as uuidv4} from 'uuid';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-form-patroller',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './form-patroller.component.html',
  styleUrl: './form-patroller.component.scss'
})
export class FormPatrollerComponent implements OnInit{
  @Input() patroller?: Patroller;
  @Input() organizationId?: string;
  @Output() save = new EventEmitter<Patroller>();
  @Output() cancel = new EventEmitter<void>();

  patrollerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private modalRef: MatDialogRef<FormPatrollerComponent>
  ) {
    this.patrollerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit() {
    if (this.patroller) {
      this.patrollerForm.patchValue(this.patroller);
    }
  }

  onSubmit() {
    if (this.patrollerForm.valid) {
      const updatedPatroller: Patroller = {
        id: this.patroller?.id ?? v4(),
        ...this.patrollerForm.value
      };
      this.apiService.addPatroller(updatedPatroller).subscribe({
        next: (patroller) => {
          this.save.emit(patroller);
          this.modalRef.close(patroller);
        },
        error: (error) => {
          console.error('Error en la acción:', error);
        },
        complete: () => {
          this.save.emit(updatedPatroller);
        },
      });
    }
  }

  onCancel() {
    this.modalRef.close(null);
    this.cancel.emit();
  }
}
