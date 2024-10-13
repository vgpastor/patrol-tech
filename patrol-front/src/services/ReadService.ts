import { Injectable } from '@angular/core';
import { TagRead } from "../models/TagRead";
import { DeviceInfoService } from "./DeviceInfoService";
import { AuthService } from "./AuthService";
import { environment } from "../environments/environment";
import { Observable, of, timer, throwError } from 'rxjs';
import { catchError, switchMap, tap, retry, delay } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ReadService {
  private tagsReads: TagRead[] = [];
  private maxRetryDelay = 60000; // 1 minuto

  constructor(
    private deviceInfoService: DeviceInfoService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.loadFromLocalStorage();
    this.startSendingToServer();
  }

  saveReadTag(identifier: string): Observable<boolean> {
    const deviceInfo = this.deviceInfoService.getDeviceInfo();
    const organization = this.authService.getOrganization();
    const patrollerIdentifier = this.authService.getPatrollerIdentifier()

    if (!organization || !patrollerIdentifier) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const newTagRead = new TagRead(
      identifier,
      new Date(),
      organization.id,
      patrollerIdentifier,
      deviceInfo
    );

    this.tagsReads.push(newTagRead);
    this.saveToLocalStorage();

    return of(true);
  }

  private saveToLocalStorage() {
    localStorage.setItem('tagReads', JSON.stringify(this.tagsReads));
  }

  private loadFromLocalStorage() {
    const storedData = localStorage.getItem('tagReads');
    if (storedData) {
      this.tagsReads = JSON.parse(storedData);
    }
  }

  private startSendingToServer() {
    timer(0, 5000).pipe(
      switchMap(() => this.sendNextTagRead())
    ).subscribe();
  }

  private sendNextTagRead(): Observable<any> {
    if (this.tagsReads.length === 0) {
      return of(null);
    }

    const tagToSend = this.tagsReads[0];
    return this.http.post(`${environment.apiServer}/api/scans`, tagToSend).pipe(
      tap(() => {
        this.tagsReads.shift();
        this.saveToLocalStorage();
      }),
      retry({
        delay: (error, retryCount) => this.getRetryDelay(error, retryCount)
      }),
      catchError(error => {
        console.error("Error sending to server:", error);
        return of(null);
      })
    );
  }

  private getRetryDelay(error: HttpErrorResponse, retryCount: number): Observable<never> | Observable<number> {
    if (retryCount > 3) {
      return throwError(() => error);
    }
    const delayTime = Math.min(1000 * Math.pow(2, retryCount), this.maxRetryDelay);
    return timer(delayTime);
  }

  getStoredReadsCount(): number {
    return this.tagsReads.length;
  }
}
