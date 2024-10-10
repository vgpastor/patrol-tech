import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterOutlet, RouterLink, Router, ActivatedRoute} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {IAuthService} from "../services/auth/domain/IAuthService";
import {ApiAuthService} from "../services/auth/infrastructure/ApiAuthService";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    NgOptimizedImage
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayout implements OnInit {

	protected readonly navigator = navigator;
	message_start: string = "Empezar";
  userAuthenticated:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(ApiAuthService) private authService: IAuthService
  ) {}

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
    if (this.authService.isAuthenticated()){
      this.message_start = "Dashboard";
      this.userAuthenticated = true;
    }
  }

  navigateToStart() {
    this.router.navigate(['/start']);
  }
}
