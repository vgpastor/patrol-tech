import { ApplicationConfig, importProvidersFrom, isDevMode, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideServiceWorker, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { ReadService } from "../services/ReadService";
import { AuthService } from "../services/AuthService";
import { OrganizationService } from "../services/OrganizationService";
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';

function checkForSwUpdate(swUpdate: SwUpdate, snackBar: MatSnackBar) {
  return () => {
    swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        const snack = snackBar.open('Actualización disponible', 'Recargar', {
          duration: 6000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });

        snack.onAction().subscribe(() => {
          window.location.reload();
        });

        snack.afterDismissed().subscribe(() => {
          swUpdate.activateUpdate().then(() => document.location.reload());
        });
      });

    swUpdate.checkForUpdate();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatSnackBar
    ),
    ReadService,
    AuthService,
    OrganizationService,
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const swUpdate = inject(SwUpdate);
        const snackBar = inject(MatSnackBar);
        return checkForSwUpdate(swUpdate, snackBar);
      },
      multi: true
    }
  ]
};
