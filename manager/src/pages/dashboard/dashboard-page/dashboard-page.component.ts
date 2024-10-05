import { Component } from '@angular/core';
import {ScanListComponent} from "../../scan-list/scan-list.component";
import {MatCard, MatCardModule} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    ScanListComponent,
    MatCardModule,
    MatIcon
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {

}
