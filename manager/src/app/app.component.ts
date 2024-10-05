import {AfterViewInit, Component} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {GoogleTagManagerService} from "angular-google-tag-manager";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit{
  title = 'manager';

  constructor(
    private router: Router,
    private gtmService: GoogleTagManagerService
  ) {
  }

  ngAfterViewInit(): void {
    this.trackPageView();
  }

  private trackPageView() {
    this.gtmService.addGtmToDom().then(
      (res) => {
        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            this.gtmService.pushTag({
              event: 'page',
              page: event.urlAfterRedirects
            }).then(r => console.log("Page view", r));
          }
        });
      }
    );
  }
}
