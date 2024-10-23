import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import {Organization} from "../models/Organization";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private resetTimerSubscription: Subscription | null = null;

  constructor(private router: Router) {
    this.checkAuthentication();
    this.startResetTimer();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(patrollerIdentifier: string): void {
    localStorage.setItem('patrollerIdentifier', patrollerIdentifier);
    localStorage.setItem('lastLoginTime', Date.now().toString());
    this.isAuthenticatedSubject.next(true);
    this.startResetTimer();
  }

  logout(): void {
    localStorage.removeItem('organizationId');
    localStorage.removeItem('patrollerIdentifier');
    localStorage.removeItem('lastLoginTime');
    this.isAuthenticatedSubject.next(false);
    if (this.resetTimerSubscription) {
      this.resetTimerSubscription.unsubscribe();
    }
    this.redirectToLogin();
  }

  getOrganization(): Organization | null {
    return JSON.parse(localStorage.getItem('organization') ?? 'null');
  }

  getPatrollerIdentifier(): string | null {
    return localStorage.getItem('patrollerIdentifier');
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  private checkAuthentication(): void {
    const organizationId = this.getOrganization()?.id;
    const patrollerIdentifier = this.getPatrollerIdentifier();
    this.isAuthenticatedSubject.next(!!organizationId && !!patrollerIdentifier);
  }

  private async startResetTimerBackgroundAsync(): Promise<void> {
    try {
        const registration = await navigator.serviceWorker.ready;

        if ('periodicSync' in registration) {
          const periodicSync = (registration as any).periodicSync;

          try {
            await periodicSync.register('login-sync', {
              minInterval: 60 * 60 * 1000,
            });
            console.log('Periodic sync registered successfully!');
          } catch (error) {
            console.error('Periodic sync registration failed:', error);
          }
        } else {
          console.error('Periodic sync not supported in this browser.');
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
  }

  private startResetTimer(): void {
    if (this.resetTimerSubscription) {
      this.resetTimerSubscription.unsubscribe();
    }

    this.resetTimerSubscription = interval(60000) // Verifica cada minuto
      .pipe(takeWhile(() => this.isAuthenticated()))
      .subscribe(() => {
        const lastLoginTime = localStorage.getItem('lastLoginTime');
        if (lastLoginTime) {
          const hoursPassed = (Date.now() - parseInt(lastLoginTime, 10)) / (1000 * 60 * 60);
          if (hoursPassed >= 1) {
            this.resetPatrollerIdentifier();
          }
        }
      });
  }

  private resetPatrollerIdentifier(): void {
    localStorage.removeItem('patrollerIdentifier');
    localStorage.removeItem('lastLoginTime');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.resetTimerSubscription) {
      this.resetTimerSubscription.unsubscribe();
    }
  }

  setOrganization(organization: Organization) {
    localStorage.setItem('organization', JSON.stringify(organization));
  }
}
