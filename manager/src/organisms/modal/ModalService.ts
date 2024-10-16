import { Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {GenericModalComponent} from "./GenericModalComponent";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  openModal<T, R = any>(componentType: Type<T>, data: Partial<T> & { title?: string }): {
    afterClosed: () => Observable<R|undefined>,
    componentInstance: T
  } {
    const dialogRef = this.dialog.open<GenericModalComponent<T>, any, R>(GenericModalComponent, {
      width: '500px',
      data: {
        componentType,
        componentData: data,
        title: data.title || 'Modal'
      }
    });

    return {
      afterClosed: () => dialogRef.afterClosed(),
      componentInstance: dialogRef.componentInstance.componentRef?.instance as T
    };
  }
}
