import {Component, inject, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from "@angular/material/button";
import {MatStepper, MatStepperModule} from "@angular/material/stepper";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatCommonModule} from "@angular/material/core";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatListModule} from "@angular/material/list";
import {Observable, of, tap} from "rxjs";
import {ApiAuthService} from "../../services/auth/infrastructure/ApiAuthService";
import {IAuthService} from "../../services/auth/domain/IAuthService";
import {ApiUserService} from "../../services/dashboard/infrastructure/ApiUserService";
import {IUserService} from "../../services/dashboard/domain/IUserService";
import {Patroller} from "../../services/dashboard/domain/Patroller";
import {Checkpoint} from "../../services/dashboard/domain/Checkpoint";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatStepperModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCommonModule,
    CommonModule,
    MatListModule,
  ],
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  currentStep = 1;
  totalSteps = 7;
  formData: FormGroup;
  clientTypes = ['Empresa seguridad', 'Empresa de mantenimiento', 'Comunidad de propietarios', 'Otros'];
  locations: any[] = [];
  patrollers = new MatTableDataSource<Patroller>([]);
  checkpoints= new MatTableDataSource<Checkpoint>([]);
  uniqueId: string;
  organizationId?: string;
  locationId?: string;

  formGroupStep1: FormGroup;
  formGroupStep2: FormGroup;
  formGroupStep3: FormGroup;
  formGroupStep4: FormGroup;
  formGroupStep5: FormGroup;

  formPatroller: FormGroup;
  formCheckpoint: FormGroup;

  @ViewChild('stepper') private stepper?: MatStepper;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(ApiAuthService) private authService: IAuthService,
    @Inject(ApiUserService) private userService: IUserService
) {
    this.uniqueId = uuidv4();

    this.patrollers = new MatTableDataSource();


    this.formGroupStep1 = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.formGroupStep2 = this.fb.group({
      clientType: ['', Validators.required]
    });

    this.formGroupStep3 = this.fb.group({
      otherNeeds: [''],
      companyName: [''],
      address: ['']
    });

    this.formGroupStep4 = this.fb.group({
      patrollers: [[], [Validators.required, Validators.minLength(1)]],
    });

    this.formGroupStep5 = this.fb.group({
      checkpoints: [[], [Validators.required, Validators.minLength(1)]],
    });

    this.formPatroller = this.fb.group({
      name: [''],
      email: ['']
    });

    this.formCheckpoint = this.fb.group({
      name: [''],
      category: [''],
      tags: ['']
    });

    this.formData = this.fb.group({
      step1: this.formGroupStep1,
      step2: this.formGroupStep2,
      step3: this.formGroupStep3,
      step4: this.formGroupStep4,
      step5: this.formGroupStep5
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  nextStep() {
      this.saveStepData().subscribe({
        next: (response) => {
          console.log("NEXT STEP",response);
          if (this.stepper != null){
            this.stepper.next()
            this.currentStep++;
          }
        },
        error: (error) => {
          if (this.stepper != null){
            // this.stepper.previous()
          }
          console.error("ERROR END",error);
        }
      });
    //
  }

  previousStep() {
    if (this.currentStep > 1 && this.stepper != null) {
      this.stepper.previous()
      this.currentStep--;
    }
  }

  saveStepData(): Observable<any>{
    switch (this.currentStep) {
      case 1:
        return this.authService.register(this.uniqueId, this.formData.get('step1')?.get('name')?.value, this.formData.get('step1')?.get('email')?.value).pipe(tap({
          next: (response) => {
          },
          error: (error) => {
            if (error.status == 400){
              this.snackBar.open(error.error.message, 'Cerrar', {
                duration: 5000
              });
            }
            console.error(error);
          }
        }));
      case 3:
        return this.userService.registerOrganization(this.uniqueId, this.formData.get('step2')?.get('clientType')?.value, this.formData.get('step3')?.value.companyName,this.formData.get('step3')?.value.address).pipe(tap({
          next: (response) => {
            this.organizationId = response.organizationId;
            this.locationId = response.locationId;
          }
        }));
      case 4:
        if(!this.organizationId){
          throw new Error('Organization ID not found');
        }
        return this.userService.registerPatrollers(this.uniqueId, this.organizationId, this.formData.get('step4')?.get('patrollers')?.value).pipe(tap({
          next: (response) => {
          }
        }));
      case 5:
        if(!this.locationId){
          throw new Error('Location ID not found');
        }
        return this.userService.registerCheckpoints(this.uniqueId, this.locationId, this.formData.get('step5')?.get('checkpoints')?.value).pipe(tap({
          next: (response) => {
          }
        }));
    }
    return of(null)
  }

  addLocation() {
    const locationData = this.formData.get('step3')?.value;
    this.locations.push(locationData);
    this.formData.get('step3')?.reset();
  }

  addPatroller() {
    if (this.formPatroller?.invalid) {
      return;
    }
    const patrollerData = this.formPatroller?.value;
    const patroller = {
      id: uuidv4(),
      name: patrollerData.name,
      email: patrollerData.email
    }
    this.patrollers.data.push(patroller);
    this.patrollers = new MatTableDataSource(this.patrollers.data);
    let patrollers_form = this.formData.get('step4')?.get('patrollers')?.value;
    patrollers_form.push(patroller);
    this.formData.get('step4')?.get('patrollers')?.setValue(patrollers_form);

    this.formPatroller.reset();
  }

  addQRPoint() {
    const qrPointData = this.formCheckpoint?.value;
    if (this.formCheckpoint?.invalid) {
      return;
    }
    this.checkpoints.data.push({
      id: uuidv4(),
      name: qrPointData.name,
      category: qrPointData.category,
      tags: this.checkpointTags
    });
    this.checkpoints = new MatTableDataSource(this.checkpoints.data);
    let checkpoints_form = this.formData.get('step5')?.get('checkpoints')?.value;
    checkpoints_form.push({
      name: qrPointData.name,
      category: qrPointData.category,
      tags: this.checkpointTags
    });
    this.formData.get('step5')?.get('checkpoints')?.setValue(checkpoints_form);
    this.formCheckpoint?.reset({
      name: '',
      category: '',
      tags: ''
    });
    this.checkpointTags = [];
  }

  finishSetup() {
    this.currentStep = 5;
    this.saveStepData().subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.error("ERROR END",error);
      }
    })
    this.router.navigate(['/how-to-start']);
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  checkpointTags: string[] = [];

  getClientTypeIcon(type: string): string {
    switch (type) {
      case 'Empresa seguridad':
        return 'security';
      case 'Empresa de mantenimiento':
        return 'build';
      case 'Comunidad de propietarios':
        return 'apartment';
      case 'Otros':
        return 'more_horiz';
      default:
        return 'help';
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.checkpointTags.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.checkpointTags.indexOf(tag);

    if (index >= 0) {
      this.checkpointTags.splice(index, 1);
    }
  }
}
