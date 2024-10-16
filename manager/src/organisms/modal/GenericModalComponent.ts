import {Component, Inject, ViewChild, ViewContainerRef, OnInit, Type, ComponentRef} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
interface ModalData<T> {
  componentType: Type<T>;
  componentData: Partial<T>;
  title: string;
}

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <ng-container #dynamicComponentContainer></ng-container>
    </mat-dialog-content>
<!--    <mat-dialog-actions>-->
<!--      <button mat-button (click)="onClose()">Close</button>-->
<!--    </mat-dialog-actions>-->
  `
})
export class GenericModalComponent<T> implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true })
  dynamicComponentContainer!: ViewContainerRef;
  componentRef?: ComponentRef<T>;

  constructor(
    public dialogRef: MatDialogRef<GenericModalComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData<T>
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    this.componentRef = this.dynamicComponentContainer.createComponent<T>(this.data.componentType);

    Object.keys(this.data.componentData).forEach(key => {
      (this.componentRef!.instance as any)[key] = this.data.componentData[key as keyof T];
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
