import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {environment} from "./environments/environment";

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if (environment.production && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ngsw-worker.js').then(() => {
        console.log('Service Worker registered');

        // Cargar el script personalizado
        const script = document.createElement('script');
        script.src = '/sw-custom.js';
        document.head.appendChild(script);
      }).catch(err => console.error('Service Worker registration failed:', err));
    }
  })
  .catch(err => console.error(err));
