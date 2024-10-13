import {Component, Inject, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {AsyncPipe, NgIf} from "@angular/common";
import {MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatBadgeModule} from "@angular/material/badge";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {MatIconButton} from "@angular/material/button";
import {JwtPayload} from "../services/auth/domain/JwtPayload";
import {IAuthService} from "../services/auth/domain/IAuthService";
import {ApiAuthService} from "../services/auth/infrastructure/ApiAuthService";

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    RouterOutlet,
    MatIconButton,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  isHandset$: Observable<boolean> | undefined
  user: JwtPayload;
  organizationName: string = '';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    @Inject(ApiAuthService) private authService: IAuthService,
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
    this.user = this.authService.getPayload();
  }

  ngOnInit(): void {
    this.user = this.authService.getPayload();
    this.organizationName = this.authService.getOrganization(this.user.organizationId)?.name ?? '';
    console.log('User:', this.authService.getOrganization(this.user.organizationId));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

