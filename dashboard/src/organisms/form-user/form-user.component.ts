import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from "@angular/material/dialog";
import { v4 as uuidv4 } from 'uuid';
import { ApiService } from "../../services/shared/infrastructure/ApiService";
import {User} from "../../services/shared/domain/User";
import {Organization} from "../../services/shared/domain/Organization";

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent implements OnInit {
  @Input() user?: User;
  @Input() organizations: Organization[] = [];
  @Input() organizationId: string = '';
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private modalRef: MatDialogRef<FormUserComponent>
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      organizationId: [this.organizationId, Validators.required]
    });
  }

  ngOnInit() {
    if (this.user) {
      this.userForm.patchValue(this.user);
    }
    if (this.organizationId) {
      this.userForm.get('organizationId')?.setValue(this.organizationId);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser: User = {
        id: this.user?.id ?? uuidv4(),
        ...this.userForm.value
      };

      this.apiService.addUser(updatedUser).subscribe({
        next: () => {
          updatedUser.createdAt = new Date().toISOString();
          this.save.emit(updatedUser);
          this.modalRef.close(updatedUser);
        },
        error: (error) => {
          console.error('Error en la acción:', error);
        },
        complete: () => {
          this.save.emit(updatedUser);
        },
      });
    }
  }

  onCancel() {
    this.modalRef.close(null);
    this.cancel.emit();
  }
}
