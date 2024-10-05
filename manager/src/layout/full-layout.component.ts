import { Component } from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {RouterOutlet} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-full-layout',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    RouterOutlet,
    NgOptimizedImage
  ],
  templateUrl: './full-layout.component.html',
  styleUrl: './full-layout.component.scss'
})
export class FullLayoutComponent {

}
