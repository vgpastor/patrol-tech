import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {AuthService} from "../services/AuthService";
import {MatFabButton} from "@angular/material/button";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatIcon, NgOptimizedImage, MatFabButton, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'patrol-front';
  organizationName = '';
  isLogged = false;
  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isLogged = isAuthenticated;
        if (isAuthenticated) {
          this.organizationName = this.authService.getOrganization()?.name ?? '';
        } else {
          this.organizationName = '';
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
  }
}
